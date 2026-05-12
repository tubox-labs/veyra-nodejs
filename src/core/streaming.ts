import { makeApiError, VeyraError, VeyraStreamConsumedError, isErrorPayload } from "./errors.js";

/**
 * An async iterable of SSE-parsed, strongly-typed objects.
 */
export class Stream<T> implements AsyncIterable<T> {
  private readonly _response: Response;
  private readonly _deserialise: (raw: string) => T;
  private _consumed = false;

  constructor(response: Response, deserialise: (raw: string) => T) {
    this._response = response;
    this._deserialise = deserialise;
  }

  /**
   * Iterate over SSE events.
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    if (this._consumed) {
      throw new VeyraStreamConsumedError("This stream has already been consumed.");
    }
    this._consumed = true;

    const body = this._response.body;
    if (!body) {
      throw new VeyraError("Streaming response did not include a readable body.");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

        while (true) {
          const eventSeparator = buffer.indexOf("\n\n");
          if (eventSeparator === -1) break;

          const eventChunk = buffer.slice(0, eventSeparator);
          buffer = buffer.slice(eventSeparator + 2);

          const data = extractDataLine(eventChunk);
          if (!data) {
            continue;
          }

          if (data === "[DONE]") {
            return;
          }

          let parsed: unknown;
          try {
            parsed = JSON.parse(data);
          } catch {
            throw new VeyraError(`Malformed SSE data: ${data}`);
          }

          if (isErrorPayload(parsed)) {
            throw makeApiError({
              body: parsed,
              headers: this._response.headers,
              requestId:
                this._response.headers.get("X-Request-ID") ??
                this._response.headers.get("x-request-id") ??
                undefined,
            });
          }

          yield this._deserialise(data);
        }
      }

      const trailingData = extractDataLine(buffer);
      if (trailingData && trailingData !== "[DONE]") {
        yield this._deserialise(trailingData);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Convert the stream to a browser/edge-compatible {@link ReadableStream}.
   */
  toReadableStream(): ReadableStream<Uint8Array> {
    if (!this._response.body) {
      throw new VeyraError("Streaming response did not include a readable body.");
    }
    return this._response.body;
  }
}

function extractDataLine(rawEvent: string): string | null {
  if (!rawEvent.trim()) return null;

  const dataLines: string[] = [];
  for (const line of rawEvent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!trimmed.startsWith("data:")) continue;
    dataLines.push(trimmed.slice(5).trim());
  }

  if (dataLines.length === 0) {
    return null;
  }

  return dataLines.join("\n");
}
