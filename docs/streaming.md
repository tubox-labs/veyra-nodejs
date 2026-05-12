# Streaming

Streaming-capable endpoints return `Stream<T>`.

```ts
const stream = await client.chat.completions.create({ ...params, stream: true });
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
}
```

You can break early and use `toReadableStream()` for browser/edge output.
