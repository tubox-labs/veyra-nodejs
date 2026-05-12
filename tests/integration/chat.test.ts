import { describe, expect, it } from "vitest";
import {
  VeyraAuthenticationError,
  VeyraBadRequestError,
  VeyraInternalServerError,
  VeyraPermissionDeniedError,
  VeyraRateLimitError,
} from "../../src/core/errors.js";
import { chatFixture } from "../helpers/fixtures/index.js";
import { errorBody, getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("chat integration", () => {
  it("creates chat completion and maps response fields to camelCase", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: chatFixture }]);

    const result = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      maxCompletionTokens: 12,
    });

    expect(result.choices[0]?.message.content).toBe("Hello from Veyra");
    expect(result.usage?.totalTokens).toBe(15);

    const { url, init } = getCall(mockFetch);
    expect(init.method).toBe("POST");
    expect(url).toContain("/v1/chat/completions");

    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer veyra_sk_test");

    const body = parseJSONBody(init);
    expect(body.max_completion_tokens).toBe(12);
  });

  it("maps standard API errors", async () => {
    const matrix = [
      { status: 400, code: "bad_request", expected: VeyraBadRequestError },
      { status: 401, code: "invalid_api_key", expected: VeyraAuthenticationError },
      { status: 403, code: "permission_denied", expected: VeyraPermissionDeniedError },
      { status: 429, code: "rate_limit", expected: VeyraRateLimitError },
      { status: 500, code: "server_error", expected: VeyraInternalServerError },
    ];

    for (const testCase of matrix) {
      const { client } = makeClient([
        {
          status: testCase.status,
          body: errorBody(testCase.code),
          headers: { "X-Request-ID": "req_1" },
        },
      ]);

      await expect(
        client.chat.completions.create({
          model: "gpt-5.4-mini",
          messages: [{ role: "user", content: "x" }],
        }),
      ).rejects.toBeInstanceOf(testCase.expected);
    }
  });

  it("retries 503s then succeeds", async () => {
    const { client, mockFetch } = makeClient([
      { status: 503, body: errorBody("provider_unavailable") },
      { status: 503, body: errorBody("provider_unavailable") },
      { status: 200, body: chatFixture },
    ]);

    const result = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "retry" }],
    });

    expect(result.id).toBe("chatcmpl_1");
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
