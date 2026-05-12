import { exponentialBackoffWithJitter } from "./backoff.js";
import {
  isErrorPayload,
  makeApiError,
  VeyraAPIConnectionAbortedError,
  VeyraAPIConnectionError,
  VeyraAPITimeoutError,
  VeyraAuthenticationError,
  VeyraError,
} from "./errors.js";
import { fetchWithRetry } from "./fetch.js";
import { buildHeaders } from "./headers.js";
import type { RequestOptions } from "./requestOptions.js";
import type { APIResponse } from "./response.js";
import { attachRaw, strip, toCamelCase, toQueryParams, toSnakeCase } from "../lib/typeUtils.js";
import type { ErrorEnvelope } from "../types/shared.js";

export const DEFAULT_BASE_URL = "https://veyra.tubox.cloud";
export const DEFAULT_TIMEOUT_MS = 60_000;
export const DEFAULT_MAX_RETRIES = 2;

export interface ClientOptions {
  /**
   * Veyra API key (`veyra_sk_...`).
   * Falls back to the `VEYRA_API_KEY` environment variable when omitted.
   */
  apiKey?: string;

  /**
   * Override the default base URL `https://veyra.tubox.cloud`.
   * Falls back to `VEYRA_BASE_URL` environment variable.
   */
  baseURL?: string;

  /** Request timeout in milliseconds (default `60_000`). */
  timeout?: number;

  /** Number of automatic retries on retryable errors (default `2`). */
  maxRetries?: number;

  /** HTTP headers merged into every request. */
  defaultHeaders?: Record<string, string>;

  /** Provide a custom `fetch` implementation. */
  fetch?: typeof globalThis.fetch;
}

interface InternalClientOptions extends ClientOptions {
  __rawResponseMode?: boolean;
}

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export abstract class VeyraClient {
  readonly apiKey: string;
  readonly baseURL: string;
  readonly timeout: number;
  readonly maxRetries: number;

  protected readonly _defaultHeaders: Record<string, string>;
  protected readonly _fetch: typeof globalThis.fetch;
  protected readonly _rawResponseMode: boolean;

  constructor(options: InternalClientOptions = {}) {
    const resolvedKey =
      options.apiKey ??
      (typeof process !== "undefined" ? process.env["VEYRA_API_KEY"] : undefined) ??
      "";

    if (!resolvedKey) {
      throw new VeyraAuthenticationError(
        "No API key provided. Pass apiKey: '...' or set the VEYRA_API_KEY environment variable.",
      );
    }

    this.apiKey = resolvedKey;
    this.baseURL = (
      options.baseURL ??
      (typeof process !== "undefined" ? process.env["VEYRA_BASE_URL"] : undefined) ??
      DEFAULT_BASE_URL
    ).replace(/\/$/, "");
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this._defaultHeaders = options.defaultHeaders ?? {};
    this._fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    this._rawResponseMode = options.__rawResponseMode ?? false;
  }

  protected _cloneClientOptions(rawResponseMode: boolean): InternalClientOptions {
    return {
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      defaultHeaders: { ...this._defaultHeaders },
      fetch: this._fetch,
      __rawResponseMode: rawResponseMode,
    };
  }

  /** Build the merged headers for a single request. */
  protected _buildHeaders(
    extra?: Record<string, string>,
    hasBody?: boolean,
    isMultipart?: boolean,
  ): Record<string, string> {
    return buildHeaders({
      apiKey: this.apiKey,
      defaultHeaders: this._defaultHeaders,
      requestHeaders: extra,
      hasBody,
      isMultipart,
    });
  }

  /**
   * Core request dispatcher. Handles serialisation, timeout, retry, and error mapping.
   */
  protected async _request<T>(
    method: HTTPMethod,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>,
    opts?: RequestOptions,
  ): Promise<T | APIResponse<T>> {
    const response = await this._requestRaw(method, path, body, params, opts);

    const requestId =
      response.headers.get("X-Request-ID") ?? response.headers.get("x-request-id") ?? undefined;

    if (!response.ok) {
      throw await this._buildAPIError(response, requestId);
    }

    const data = await this._parseResponseBody<T>(response);
    if (this._rawResponseMode) {
      return {
        data,
        requestId,
        httpStatus: response.status,
        headers: response.headers,
      };
    }

    return data;
  }

  /**
   * Variant that returns the raw {@link Response}.
   */
  protected async _requestRaw(
    method: HTTPMethod,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>,
    opts?: RequestOptions,
  ): Promise<Response> {
    const baseURL = (opts?.baseURL ?? this.baseURL).replace(/\/$/, "");
    const timeout = opts?.timeout ?? this.timeout;
    const maxRetries = opts?.maxRetries ?? this.maxRetries;

    const url = this._buildURL(baseURL, path, params);
    const isMultipart = typeof FormData !== "undefined" && body instanceof FormData;
    const headers = this._buildHeaders(opts?.headers, body !== undefined, isMultipart);

    if (isMultipart) {
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === "content-type") {
          delete headers[key];
        }
      }
    }

    const requestBody = this._serialiseBody(body, isMultipart);

    try {
      return await fetchWithRetry(
        async () =>
          this._executeFetch(url, {
            method,
            headers,
            body: requestBody,
            signal: opts?.signal,
            timeout,
          }),
        {
          maxRetries,
          shouldRetry: ({ response, error, attempt, maxRetries: retryBudget }) => {
            if (error) {
              if (error instanceof VeyraAPIConnectionAbortedError) {
                return false;
              }
              if (attempt >= retryBudget) {
                return false;
              }
              return true;
            }

            return this._shouldRetry(response, attempt, retryBudget);
          },
          retryDelay: ({ response, attempt }) => this._retryDelay(response, attempt),
        },
      );
    } catch (error) {
      if (error instanceof VeyraError) {
        throw error;
      }

      throw new VeyraAPIConnectionError(
        "Connection error while communicating with the Veyra API.",
        error,
      );
    }
  }

  /** Whether this status code + body should be retried. */
  protected _shouldRetry(response: Response | null, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false;
    if (response === null) return true;
    return [429, 500, 502, 503, 504].includes(response.status);
  }

  /** Milliseconds to wait before the next attempt. */
  protected _retryDelay(response: Response | null, attempt: number): number {
    const retryAfterHeader = response?.headers.get("Retry-After");
    if (retryAfterHeader) {
      const parsed = Number.parseFloat(retryAfterHeader);
      if (!Number.isNaN(parsed)) return parsed * 1000;
    }
    return exponentialBackoffWithJitter(attempt);
  }

  private _serialiseBody(body: unknown, isMultipart: boolean): BodyInit | undefined {
    if (body === undefined) return undefined;
    if (isMultipart) {
      return body as FormData;
    }

    return JSON.stringify(toSnakeCase(strip(body)));
  }

  private _buildURL(
    baseURL: string,
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = path.startsWith("http://") || path.startsWith("https://")
      ? new URL(path)
      : new URL(`${baseURL}${path.startsWith("/") ? "" : "/"}${path}`);

    const query = toQueryParams(params);
    for (const [key, value] of query.entries()) {
      base.searchParams.set(key, value);
    }

    return base.toString();
  }

  private async _executeFetch(
    url: string,
    options: {
      method: HTTPMethod;
      headers: Record<string, string>;
      body: BodyInit | undefined;
      signal: AbortSignal | undefined;
      timeout: number;
    },
  ): Promise<Response> {
    if (options.signal?.aborted) {
      throw new VeyraAPIConnectionAbortedError("Request was aborted before dispatch.");
    }

    const controller = new AbortController();
    let timedOut = false;

    const onAbort = () => {
      controller.abort(options.signal?.reason);
    };

    options.signal?.addEventListener("abort", onAbort, { once: true });

    const timeoutHandle =
      options.timeout > 0
        ? setTimeout(() => {
            timedOut = true;
            controller.abort(new Error(`Request timed out after ${options.timeout}ms`));
          }, options.timeout)
        : null;

    try {
      const init: RequestInit = {
        method: options.method,
        headers: options.headers,
        signal: controller.signal,
      };

      if (options.body !== undefined) {
        init.body = options.body;
      }

      return await this._fetch(url, init);
    } catch (error) {
      if (isAbortLike(error)) {
        if (options.signal?.aborted) {
          throw new VeyraAPIConnectionAbortedError("Request was aborted by caller.", error);
        }

        if (timedOut) {
          throw new VeyraAPITimeoutError(`Request timed out after ${options.timeout}ms.`, error);
        }

        throw new VeyraAPIConnectionAbortedError("Request aborted.", error);
      }

      throw error;
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      options.signal?.removeEventListener("abort", onAbort);
    }
  }

  private async _buildAPIError(response: Response, requestId: string | undefined): Promise<Error> {
    const fallback = (): ErrorEnvelope => ({
      error: {
        code: `http_${response.status}`,
        message: response.statusText || `Request failed with status ${response.status}`,
      },
    });

    const text = await response.text();
    if (!text) {
      return makeApiError({
        status: response.status,
        body: fallback(),
        headers: response.headers,
        requestId,
      });
    }

    try {
      const parsed = JSON.parse(text) as unknown;
      if (isErrorPayload(parsed)) {
        return makeApiError({
          status: response.status,
          body: parsed,
          headers: response.headers,
          requestId,
        });
      }
    } catch {
      // Ignore parse error and fall back to status text.
    }

    return makeApiError({
      status: response.status,
      body: {
        error: {
          code: `http_${response.status}`,
          message: text || response.statusText || `Request failed with status ${response.status}`,
        },
      },
      headers: response.headers,
      requestId,
    });
  }

  private async _parseResponseBody<T>(response: Response): Promise<T> {
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    let raw: unknown = text;
    try {
      raw = JSON.parse(text) as unknown;
    } catch {
      // non-json bodies are returned as-is
    }

    const data = attachRaw(toCamelCase(raw) as T, raw);
    return data;
  }
}

function isAbortLike(error: unknown): boolean {
  return (
    error instanceof DOMException
      ? error.name === "AbortError"
      : typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: unknown }).name === "AbortError"
  );
}

export type { RequestOptions } from "./requestOptions.js";
