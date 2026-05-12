import { describe, expect, it } from "vitest";
import { Stream } from "../../src/core/streaming.js";
import { VeyraAPIError, VeyraStreamConsumedError } from "../../src/core/errors.js";
import { buildSSEStream } from "../helpers/sseFixture.js";

describe("Stream", () => {
  it("skips empty lines and yields chunks", async () => {
    const body = buildSSEStream([
      { type: "chunk", value: "a" },
      { type: "chunk", value: "b" },
      "[DONE]",
    ]);

    const stream = new Stream<{ type: string; value: string }>(
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
      (raw) => JSON.parse(raw) as { type: string; value: string },
    );

    const values: string[] = [];
    for await (const chunk of stream) {
      values.push(chunk.value);
    }

    expect(values).toEqual(["a", "b"]);
  });

  it("throws API error when SSE event carries error payload", async () => {
    const body = buildSSEStream([
      {
        error: {
          code: "bad_request",
          message: "fail",
        },
      },
      "[DONE]",
    ]);

    const stream = new Stream(new Response(body), (raw) => JSON.parse(raw) as unknown);

    await expect(async () => {
      for await (const chunk of stream) {
        void chunk;
      }
    }).rejects.toBeInstanceOf(VeyraAPIError);
  });

  it("throws if stream is consumed twice", async () => {
    const body = buildSSEStream([{ value: "once" }, "[DONE]"]);
    const stream = new Stream<{ value: string }>(new Response(body), (raw) => JSON.parse(raw));

    for await (const chunk of stream) {
      void chunk;
      break;
    }

    await expect(async () => {
      for await (const chunk of stream) {
        void chunk;
      }
    }).rejects.toBeInstanceOf(VeyraStreamConsumedError);
  });

  it("handles break without hanging and exposes readable body", async () => {
    const body = buildSSEStream([{ value: "first" }, { value: "second" }, "[DONE]"]);
    const response = new Response(body);
    const stream = new Stream<{ value: string }>(response, (raw) => JSON.parse(raw));

    for await (const chunk of stream) {
      expect(chunk.value).toBe("first");
      break;
    }

    expect(stream.toReadableStream()).toBe(response.body);
  });
});
