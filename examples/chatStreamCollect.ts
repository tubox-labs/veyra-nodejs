import Veyra from "@tubox/veyra-sdk";
import { collectStream } from "@tubox/veyra-sdk/streaming";

const client = new Veyra();

const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "List three Python best practices." }],
  stream: true,
});

const completion = await collectStream(stream);
console.log(completion.choices[0]?.message.content);
