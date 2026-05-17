import { describe, expect, it } from "vitest";
import { Veyra } from "../../src/index.js";
import { createMockFetch } from "../helpers/mockFetch.js";
import { buildSSEStream } from "../helpers/sseFixture.js";

describe("streaming regressions", () => {
  it("camel-cases chat stream chunks including finish reason and fingerprint", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: "" }]);
    mockFetch.mockResolvedValue(
      new Response(
        buildSSEStream([
          {
            id: "chatcmpl_1",
            object: "chat.completion.chunk",
            created: 1,
            model: "gpt-5.4-mini",
            system_fingerprint: "fp_123",
            choices: [
              {
                index: 0,
                delta: { role: "assistant", content: "hello", reasoning: "short trace" },
                finish_reason: "stop",
              },
            ],
            usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
          },
          "[DONE]",
        ]),
      ),
    );

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    const stream = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    });

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks[0]?.choices[0]?.finishReason).toBe("stop");
    expect(chunks[0]?.choices[0]?.delta.reasoning).toBe("short trace");
    expect(chunks[0]?.systemFingerprint).toBe("fp_123");
    expect(chunks[0]?.usage?.promptTokens).toBe(1);
  });

  it("camel-cases assistant stream events", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: "" }]);
    mockFetch.mockResolvedValue(
      new Response(
        buildSSEStream([
          {
            type: "meta",
            requires_login: false,
            scope_limited: false,
            references: ["account:model-access"],
          },
          { type: "delta", delta: "hello" },
          { type: "done", done: true },
          "[DONE]",
        ]),
      ),
    );

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    const stream = await client.assistant.chat({ message: "hello", stream: true });

    const events = [];
    for await (const event of stream) {
      events.push(event);
    }

    expect(events[0]?.requiresLogin).toBe(false);
    expect(events[0]?.scopeLimited).toBe(false);
    expect(events[1]?.delta).toBe("hello");
    expect(events[2]?.done).toBe(true);
  });

  it("camel-cases text completion stream chunks", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: "" }]);
    mockFetch.mockResolvedValue(
      new Response(
        buildSSEStream([
          {
            id: "cmpl_1",
            object: "text_completion.chunk",
            created: 1,
            model: "gpt-5.4-mini",
            choices: [{ index: 0, text: "hello", finish_reason: "stop" }],
            usage: { prompt_tokens: 2, completion_tokens: 3, total_tokens: 5 },
          },
          "[DONE]",
        ]),
      ),
    );

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    const stream = await client.completions.create({
      model: "gpt-5.4-mini",
      prompt: "hello",
      stream: true,
    });

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks[0]?.choices[0]?.finishReason).toBe("stop");
    expect(chunks[0]?.usage?.completionTokens).toBe(3);
  });
});
