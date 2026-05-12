import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Explain the Veyra quota system in one paragraph." }],
  maxCompletionTokens: 256,
});

console.log(completion.choices[0]?.message.content);
console.log(`\n[tokens used: ${completion.usage?.totalTokens}]`);
