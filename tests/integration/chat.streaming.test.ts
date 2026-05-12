import { describe, expect, it } from "vitest";
import { Veyra } from "../../src/index.js";
import { createMockFetch } from "../helpers/mockFetch.js";
import { buildSSEStream } from "../helpers/sseFixture.js";
import { collectStream, streamToString } from "../../src/lib/streamHelpers.js";

describe("chat streaming integration", () => {
  it("streams chunks and supports collect helpers", async () => {
    const mockFetch = createMockFetch([{ status: 200, body: "" }]);
    mockFetch.mockImplementation(async () =>
      new Response(
        buildSSEStream([
          {
            id: "chatcmpl_1",
            object: "chat.completion.chunk",
            created: 1710000000,
            model: "gpt-5.4-mini",
            choices: [{ index: 0, delta: { role: "assistant", content: "Hel" }, finish_reason: null }],
          },
          {
            id: "chatcmpl_1",
            object: "chat.completion.chunk",
            created: 1710000001,
            model: "gpt-5.4-mini",
            choices: [{ index: 0, delta: { content: "lo" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          },
          "[DONE]",
        ]),
        {
          status: 200,
          headers: { "Content-Type": "text/event-stream" },
        },
      ),
    );

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    const stream = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    });

    let output = "";
    for await (const chunk of stream) {
      output += chunk.choices[0]?.delta.content ?? "";
    }

    expect(output).toBe("Hello");

    const stream2 = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    });

    const text = await streamToString(stream2);
    expect(text).toBe("Hello");

    const stream3 = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    });
    const completion = await collectStream(stream3);
    expect(completion.choices[0]?.message.content).toBe("Hello");
  });
});
