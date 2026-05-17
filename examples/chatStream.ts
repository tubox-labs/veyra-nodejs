import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Count slowly from 1 to 10." }],
  stream: true,
  maxCompletionTokens: 128,
});

let totalTokens: number | undefined;
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
  totalTokens = chunk.usage?.totalTokens ?? totalTokens;
}
process.stdout.write("\n");

if (totalTokens !== undefined) {
  console.log(`tokens=${totalTokens}`);
}
