import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const stream = await client.responses.create({
  model: "gpt-5.4-mini",
  input: "Write a two sentence explanation of SDK streaming.",
  stream: true,
  maxOutputTokens: 180,
});

for await (const event of stream) {
  switch (event.type) {
    case "response.output_text.delta":
      process.stdout.write(event.delta ?? "");
      break;
    case "response.completed":
      process.stdout.write("\ncompleted\n");
      break;
    default:
      break;
  }
}
