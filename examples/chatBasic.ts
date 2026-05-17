import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({
  timeout: 30_000,
  maxRetries: 2,
});

const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [
    { role: "system", content: "Be precise and practical." },
    { role: "user", content: "Explain the Veyra quota system in one paragraph." },
  ],
  maxCompletionTokens: 256,
  reasoning: { effort: "low", summary: "auto" },
});

console.log(completion.choices[0]?.message.content);
console.log("\nusage", {
  prompt: completion.usage?.promptTokens,
  completion: completion.usage?.completionTokens,
  total: completion.usage?.totalTokens,
});
