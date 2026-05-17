# Quickstart

Install the SDK and provide an API key:

```bash
npm install @tubox/veyra-sdk
export VEYRA_API_KEY=veyra_sk_...
```

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({ apiKey: process.env.VEYRA_API_KEY });
const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(completion.choices[0]?.message.content);
```

## Responses with reasoning controls

```ts
const response = await client.responses.create({
  model: "gpt-5.4-mini",
  input: "Explain the tradeoff in one paragraph.",
  reasoning: { effort: "medium", summary: "auto" },
  maxOutputTokens: 256,
});

const message = response.output.find((item) => item.type === "message");
console.log(message?.type === "message" ? message.content[0]?.text : "");
```

## Streaming

```ts
const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Count to five." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
}
```

More examples are available in [`examples/`](../examples) and documented in [`docs/examples.md`](./examples.md).
