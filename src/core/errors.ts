import type { ErrorDetail, ErrorEnvelope } from "../types/shared.js";
import { hasOwn, isRecord } from "../lib/typeUtils.js";

/**
 * Base class for all errors thrown by the Veyra SDK.
 */
export class VeyraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Received an error response from the Veyra API.
 */
export class VeyraAPIError extends VeyraError {
  readonly code: string | undefined;
  readonly httpStatus: number;
  readonly requestId: string | undefined;
  readonly headers: Headers;

  constructor(
    message: string,
    options: {
      code?: string | undefined;
      httpStatus?: number | undefined;
      requestId?: string | undefined;
      headers?: Headers | undefined;
    } = {},
  ) {
    super(message);
    this.code = options.code;
    this.httpStatus = options.httpStatus ?? 0;
    this.requestId = options.requestId;
    this.headers = options.headers ?? new Headers();
  }
}

export class VeyraBadRequestError extends VeyraAPIError {}
export class VeyraAuthenticationError extends VeyraAPIError {}
export class VeyraBillingRequiredError extends VeyraAPIError {}
export class VeyraPermissionDeniedError extends VeyraAPIError {}
export class VeyraNotFoundError extends VeyraAPIError {}
export class VeyraConflictError extends VeyraAPIError {}

export class VeyraUnprocessableEntityError extends VeyraAPIError {
  readonly details: ErrorDetail[];

  constructor(
    message: string,
    details: ErrorDetail[],
    options: ConstructorParameters<typeof VeyraAPIError>[1] = {},
  ) {
    super(message, options);
    this.details = details;
  }
}

export class VeyraRateLimitError extends VeyraAPIError {
  readonly retryAfter: number | undefined;

  constructor(
    message: string,
    retryAfter: number | undefined,
    options: ConstructorParameters<typeof VeyraAPIError>[1] = {},
  ) {
    super(message, options);
    this.retryAfter = retryAfter;
  }
}

export class VeyraInternalServerError extends VeyraAPIError {}
export class VeyraProviderUnavailableError extends VeyraAPIError {}
export class VeyraMaintenanceModeError extends VeyraAPIError {}
export class VeyraPayloadTooLargeError extends VeyraBadRequestError {}
export class VeyraModelNotAvailableError extends VeyraPermissionDeniedError {}

export class VeyraAPIConnectionError extends VeyraError {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export class VeyraAPITimeoutError extends VeyraAPIConnectionError {}
export class VeyraAPIConnectionAbortedError extends VeyraAPIConnectionError {}
export class VeyraStreamConsumedError extends VeyraError {}

export function isErrorPayload(payload: unknown): payload is ErrorEnvelope {
  if (!isRecord(payload) || !hasOwn(payload, "error")) return false;
  const error = payload.error;
  return (
    isRecord(error) &&
    typeof error.code === "string" &&
    typeof error.message === "string"
  );
}

function parseRetryAfter(headers: Headers | undefined): number | undefined {
  if (!headers) return undefined;
  const value = headers.get("Retry-After");
  if (!value) return undefined;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  return undefined;
}

/**
 * Map `(status, error.code, headers)` to the most specific error subclass.
 */
export function makeApiError(options: {
  status?: number | undefined;
  body: ErrorEnvelope;
  headers?: Headers | undefined;
  requestId?: string | undefined;
}): VeyraAPIError {
  const status = options.status ?? 500;
  const code = options.body.error.code;
  const message = options.body.error.message;
  const requestId =
    options.requestId ?? options.headers?.get("X-Request-ID") ?? options.headers?.get("x-request-id") ?? undefined;
  const shared = {
    code,
    httpStatus: status,
    requestId,
    headers: options.headers ?? new Headers(),
  };

  if (status === 400) {
    if (code === "payload_too_large") {
      return new VeyraPayloadTooLargeError(message, shared);
    }
    return new VeyraBadRequestError(message, shared);
  }

  if (status === 401) {
    return new VeyraAuthenticationError(message, shared);
  }

  if (status === 402) {
    return new VeyraBillingRequiredError(message, shared);
  }

  if (status === 403) {
    if (code === "model_not_available") {
      return new VeyraModelNotAvailableError(message, shared);
    }
    return new VeyraPermissionDeniedError(message, shared);
  }

  if (status === 404) {
    return new VeyraNotFoundError(message, shared);
  }

  if (status === 409) {
    return new VeyraConflictError(message, shared);
  }

  if (status === 422) {
    return new VeyraUnprocessableEntityError(message, options.body.error.details ?? [], shared);
  }

  if (status === 429) {
    return new VeyraRateLimitError(message, parseRetryAfter(options.headers), shared);
  }

  if (status === 500) {
    return new VeyraInternalServerError(message, shared);
  }

  if (status === 502) {
    return new VeyraProviderUnavailableError(message, shared);
  }

  if (status === 503) {
    if (code === "maintenance_mode") {
      return new VeyraMaintenanceModeError(message, shared);
    }
    return new VeyraProviderUnavailableError(message, shared);
  }

  return new VeyraAPIError(message, shared);
}
