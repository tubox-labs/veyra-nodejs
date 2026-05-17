import Veyra from "@tubox/veyra-sdk";
import { collectStream, streamToString } from "@tubox/veyra-sdk/streaming";

const client = new Veyra();

const textStream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Write a short SDK tagline." }],
  stream: true,
});

console.log(await streamToString(textStream));

const completionStream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "List three Python best practices." }],
  stream: true,
});

const completion = await collectStream(completionStream);
console.log(completion.choices[0]?.message.content);
console.log(completion.usage);
