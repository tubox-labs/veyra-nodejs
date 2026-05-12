import { describe, expect, it } from "vitest";
import {
  makeApiError,
  VeyraAuthenticationError,
  VeyraBadRequestError,
  VeyraBillingRequiredError,
  VeyraConflictError,
  VeyraInternalServerError,
  VeyraMaintenanceModeError,
  VeyraModelNotAvailableError,
  VeyraNotFoundError,
  VeyraPayloadTooLargeError,
  VeyraPermissionDeniedError,
  VeyraProviderUnavailableError,
  VeyraRateLimitError,
  VeyraUnprocessableEntityError,
} from "../../src/core/errors.js";

describe("makeApiError", () => {
  const matrix: Array<{ status: number; code: string; expected: new (...args: never[]) => Error }> = [
    { status: 400, code: "payload_too_large", expected: VeyraPayloadTooLargeError },
    { status: 400, code: "prompt_injection", expected: VeyraBadRequestError },
    { status: 401, code: "bad_auth", expected: VeyraAuthenticationError },
    { status: 402, code: "billing_required", expected: VeyraBillingRequiredError },
    { status: 403, code: "model_not_available", expected: VeyraModelNotAvailableError },
    { status: 403, code: "denied", expected: VeyraPermissionDeniedError },
    { status: 404, code: "missing", expected: VeyraNotFoundError },
    { status: 409, code: "conflict", expected: VeyraConflictError },
    { status: 422, code: "invalid", expected: VeyraUnprocessableEntityError },
    { status: 429, code: "rate_limit", expected: VeyraRateLimitError },
    { status: 500, code: "server", expected: VeyraInternalServerError },
    { status: 502, code: "upstream", expected: VeyraProviderUnavailableError },
    { status: 503, code: "maintenance_mode", expected: VeyraMaintenanceModeError },
    { status: 503, code: "provider", expected: VeyraProviderUnavailableError },
  ];

  for (const testCase of matrix) {
    it(`maps status=${testCase.status} code=${testCase.code}`, () => {
      const error = makeApiError({
        status: testCase.status,
        headers: new Headers({ "X-Request-ID": "req_123", "Retry-After": "7" }),
        requestId: undefined,
        body: {
          error: {
            code: testCase.code,
            message: "boom",
            details: [{ loc: ["field"], msg: "bad", type: "invalid" }],
          },
        },
      });

      expect(error).toBeInstanceOf(testCase.expected);
      expect(error.requestId).toBe("req_123");
    });
  }

  it("attaches validation details", () => {
    const error = makeApiError({
      status: 422,
      headers: new Headers(),
      requestId: undefined,
      body: {
        error: {
          code: "invalid",
          message: "bad",
          details: [{ loc: ["a"], msg: "required", type: "value_error" }],
        },
      },
    });

    expect(error).toBeInstanceOf(VeyraUnprocessableEntityError);
    expect((error as VeyraUnprocessableEntityError).details).toHaveLength(1);
  });

  it("derives retryAfter for rate limit errors", () => {
    const error = makeApiError({
      status: 429,
      headers: new Headers({ "Retry-After": "5" }),
      requestId: undefined,
      body: {
        error: {
          code: "rate_limit",
          message: "slow down",
        },
      },
    });

    expect(error).toBeInstanceOf(VeyraRateLimitError);
    expect((error as VeyraRateLimitError).retryAfter).toBe(5);
  });
});
