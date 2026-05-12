import { beforeEach, describe, expect, it, vi } from "vitest";
import { Veyra } from "../../src/index.js";
import {
  DEFAULT_BASE_URL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT_MS,
} from "../../src/core/client.js";
import {
  VeyraAuthenticationError,
  VeyraRateLimitError,
} from "../../src/core/errors.js";
import { createMockFetch } from "../helpers/mockFetch.js";

describe("VeyraClient", () => {
  beforeEach(() => {
    delete process.env.VEYRA_API_KEY;
    delete process.env.VEYRA_BASE_URL;
  });

  it("throws when API key is missing", () => {
    expect(() => new Veyra()).toThrowError(VeyraAuthenticationError);
  });

  it("uses VEYRA_API_KEY from environment", () => {
    process.env.VEYRA_API_KEY = "veyra_sk_env";
    const client = new Veyra();
    expect(client.apiKey).toBe("veyra_sk_env");
  });

  it("uses VEYRA_BASE_URL from environment", () => {
    process.env.VEYRA_API_KEY = "veyra_sk_env";
    process.env.VEYRA_BASE_URL = "https://edge.veyra.ai";
    const client = new Veyra();
    expect(client.baseURL).toBe("https://edge.veyra.ai");
  });

  it("honors custom base URL", () => {
    const client = new Veyra({ apiKey: "veyra_sk_test", baseURL: "https://custom.veyra.ai/" });
    expect(client.baseURL).toBe("https://custom.veyra.ai");
  });

  it("uses default timeout and retry values", () => {
    const client = new Veyra({ apiKey: "veyra_sk_test" });
    expect(client.timeout).toBe(DEFAULT_TIMEOUT_MS);
    expect(client.maxRetries).toBe(DEFAULT_MAX_RETRIES);
    expect(client.baseURL).toBe(DEFAULT_BASE_URL);
  });

  it("injects custom fetch and calls it", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: { status: "ok", checks: {} } }]);
    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });

    await client.health.ready();
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("merges default headers and allows request overrides", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: { status: "ok", checks: {} } }]);
    const client = new Veyra({
      apiKey: "veyra_sk_test",
      fetch: mockFetch as typeof fetch,
      defaultHeaders: {
        "X-From-Client": "client",
        "X-Override": "client",
      },
    });

    await client.health.ready({
      headers: {
        "X-Override": "request",
      },
    });

    const firstCall = mockFetch.mock.calls[0];
    if (!firstCall) {
      throw new Error("Expected fetch to be called");
    }
    const init = firstCall[1];
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["X-From-Client"]).toBe("client");
    expect(headers["X-Override"]).toBe("request");
    expect(headers.Authorization).toBe("Bearer veyra_sk_test");
  });

  it("disables retries when maxRetries is 0", async () => {
    const mockFetch = createMockFetch([
      {
        status: 429,
        body: {
          error: {
            code: "rate_limit",
            message: "too fast",
          },
        },
      },
    ]);

    const client = new Veyra({
      apiKey: "veyra_sk_test",
      fetch: mockFetch as typeof fetch,
      maxRetries: 0,
    });

    await expect(client.health.check()).rejects.toBeInstanceOf(VeyraRateLimitError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries retryable errors", async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const mockFetch = createMockFetch([
      {
        status: 503,
        body: {
          error: { code: "provider_unavailable", message: "retry" },
        },
      },
      {
        status: 503,
        body: {
          error: { code: "provider_unavailable", message: "retry" },
        },
      },
      {
        status: 200,
        body: { status: "ok", version: "1.0.0" },
      },
    ]);

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    const response = await client.health.check();

    expect(response.status).toBe("ok");
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(setTimeoutSpy).toHaveBeenCalled();
  });
});
