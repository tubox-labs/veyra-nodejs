import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Count slowly from 1 to 10." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
}
process.stdout.write("\n");
