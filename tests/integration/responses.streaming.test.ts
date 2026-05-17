import { describe, expect, it } from "vitest";
import { Veyra } from "../../src/index.js";
import { createMockFetch } from "../helpers/mockFetch.js";
import { buildSSEStream } from "../helpers/sseFixture.js";

describe("responses streaming integration", () => {
  it("yields all response stream events", async () => {
    const body = buildSSEStream([
      {
        type: "response.output_text.delta",
        response_id: "resp_1",
        output_index: 0,
        content_index: 0,
        delta: "hello",
      },
      {
        type: "response.completed",
        response_id: "resp_1",
        done: true,
      },
      "[DONE]",
    ]);

    const mockFetch = createMockFetch([{ status: 200, body: "" }]);
    mockFetch.mockResolvedValue(
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });

    const stream = await client.responses.create({
      model: "gpt-5.4-mini",
      input: "hello",
      stream: true,
    });

    const events: string[] = [];
    const responseIds: string[] = [];
    for await (const event of stream) {
      events.push(event.type);
      if (event.responseId) {
        responseIds.push(event.responseId);
      }
    }

    expect(events).toEqual(["response.output_text.delta", "response.completed"]);
    expect(responseIds).toEqual(["resp_1", "resp_1"]);
  });
});
