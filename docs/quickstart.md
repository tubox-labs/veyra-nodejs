# Quickstart

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({ apiKey: process.env.VEYRA_API_KEY });
const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(completion.choices[0]?.message.content);
```
