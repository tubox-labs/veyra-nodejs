/**
 * Build a `ReadableStream` that emits realistic SSE lines.
 */
export function buildSSEStream(chunks: Array<object | "[DONE]">): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        const payload = chunk === "[DONE]" ? "[DONE]" : JSON.stringify(chunk);
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      }
      controller.close();
    },
  });
}
