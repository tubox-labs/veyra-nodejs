import { describe, expect, it } from "vitest";
import { responsesFixture, chatFixture, completionsFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("request serialization regressions", () => {
  it("serializes chat reasoning and response format fields to snake_case", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: chatFixture }]);

    await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      topP: 0.9,
      maxCompletionTokens: 64,
      frequencyPenalty: 0.1,
      presencePenalty: 0.2,
      reasoningEffort: "low",
      reasoning: { effort: "medium", summary: "auto" },
      responseFormat: { type: "json_object" },
      user: "user_123",
    });

    const body = parseJSONBody(getCall(mockFetch).init);
    expect(body).toMatchObject({
      top_p: 0.9,
      max_completion_tokens: 64,
      frequency_penalty: 0.1,
      presence_penalty: 0.2,
      reasoning_effort: "low",
      reasoning: { effort: "medium", summary: "auto" },
      response_format: { type: "json_object" },
      user: "user_123",
    });
    expect(body.topP).toBeUndefined();
  });

  it("serializes Responses API message input and passthrough fields", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: responsesFixture }]);

    await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "hello" }],
        },
      ],
      instructions: "Be concise",
      maxOutputTokens: 128,
      parallelToolCalls: false,
      truncation: "auto",
      metadata: { run: "regression", ok: true, count: 1 },
      reasoning: { effort: "high", summary: "detailed" },
    });

    const body = parseJSONBody(getCall(mockFetch).init);
    expect(body.input).toEqual([
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "hello" }],
      },
    ]);
    expect(body.max_output_tokens).toBe(128);
    expect(body.parallel_tool_calls).toBe(false);
    expect(body.metadata).toEqual({ run: "regression", ok: true, count: 1 });
    expect(body.reasoning).toEqual({ effort: "high", summary: "detailed" });
  });

  it("serializes legacy completions reasoning fields and rejects multi-prompt arrays", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: completionsFixture }]);

    await client.completions.create({
      model: "gpt-5.4-mini",
      prompt: "hello",
      maxTokens: 16,
      maxCompletionTokens: 24,
      reasoning: { effort: "low" },
      responseFormat: { type: "text" },
    });

    const body = parseJSONBody(getCall(mockFetch).init);
    expect(body.max_tokens).toBe(16);
    expect(body.max_completion_tokens).toBe(24);
    expect(body.response_format).toEqual({ type: "text" });

    await expect(
      client.completions.create({
        model: "gpt-5.4-mini",
        prompt: ["one", "two"],
      }),
    ).rejects.toThrow("Multi-prompt arrays are not supported.");
  });

  it("encodes path identifiers and query parameters", async () => {
    const { client, mockFetch } = makeClient([
      { status: 200, body: { object: "model", id: "gpt/slash", created: 0, owned_by: "veyra" } },
      { status: 200, body: { id: "key_1", name: "key", scopes: [], is_active: true, created_at: "now" } },
      { status: 200, body: { items: [], total: 0, offset: 10, limit: 25, has_more: false } },
    ]);

    await client.models.retrieve("gpt/slash");
    await client.apiKeys.update("key/with space", { name: "next" });
    await client.billing.usage.list({
      offset: 10,
      limit: 25,
      since: "2026-05-01T00:00:00Z",
      until: "2026-05-17T00:00:00Z",
      model: "gpt-5.4-mini",
    });

    expect(getCall(mockFetch, 0).url).toContain("/v1/models/gpt%2Fslash");
    expect(getCall(mockFetch, 1).url).toContain("/v1/api-keys/key%2Fwith%20space");

    const usageUrl = new URL(getCall(mockFetch, 2).url);
    expect(usageUrl.searchParams.get("offset")).toBe("10");
    expect(usageUrl.searchParams.get("limit")).toBe("25");
    expect(usageUrl.searchParams.get("since")).toBe("2026-05-01T00:00:00Z");
    expect(usageUrl.searchParams.get("until")).toBe("2026-05-17T00:00:00Z");
    expect(usageUrl.searchParams.get("model")).toBe("gpt-5.4-mini");
  });
});
