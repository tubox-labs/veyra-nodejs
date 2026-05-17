# Streaming

Streaming-capable endpoints return `Stream<T>`, an async iterable over Server-Sent Events. The SDK parses `data: ...` lines, stops on `[DONE]`, converts JSON keys to camelCase, and turns streamed error envelopes into the same `VeyraAPIError` subclasses as non-streaming requests.

```ts
const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Count to 5" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
}
```

## Responses stream

```ts
const stream = await client.responses.create({
  model: "gpt-5.4-mini",
  input: "Say hello.",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta ?? "");
  }
}
```

## Collecting chat output

```ts
import { collectStream, streamToString } from "@tubox/veyra-sdk/streaming";

const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Write a title." }],
  stream: true,
});

const text = await streamToString(stream);
console.log(text);
```

`collectStream()` rebuilds a `ChatCompletion` object from chunk events, preserving the last observed usage and system fingerprint values.

## Important behavior

- A `Stream<T>` can be consumed once. A second iteration throws `VeyraStreamConsumedError`.
- Breaking out of a loop releases the reader lock.
- `toReadableStream()` exposes the raw response body for browser or edge piping.
- Streamed API error payloads throw SDK API errors before yielding the error event.
