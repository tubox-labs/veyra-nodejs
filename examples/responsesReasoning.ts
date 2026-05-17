import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const response = await client.responses.create({
  model: "gpt-5.4-mini",
  instructions: "Answer for an SDK maintainer. Keep it concrete.",
  input: [
    {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: "Explain how retries and timeouts interact." }],
    },
  ],
  reasoning: { effort: "medium", summary: "auto" },
  parallelToolCalls: false,
  truncation: "auto",
  maxOutputTokens: 300,
});

for (const item of response.output) {
  if (item.type === "reasoning") {
    console.log("reasoning summary:", item.summary?.map((part) => part.text).join("\n") ?? "");
  }

  if (item.type === "message") {
    console.log("answer:", item.content.map((part) => part.text).join(""));
  }
}

console.log("usage", {
  input: response.usage?.inputTokens,
  cached: response.usage?.inputTokensDetails?.cachedTokens,
  output: response.usage?.outputTokens,
  reasoning: response.usage?.outputTokensDetails?.reasoningTokens,
  total: response.usage?.totalTokens,
});
