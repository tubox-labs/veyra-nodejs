import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const result = await client.images.generations.create({
  model: "gpt-image-2",
  prompt: "A minimalist logo for an AI API platform, flat design, dark background",
  n: 1,
  size: "1024x1024",
  quality: "standard",
  responseFormat: "url",
});

for (const [index, image] of result.data.entries()) {
  console.log(index, image.url ?? image.b64Json?.slice(0, 80), image.revisedPrompt);
}
