import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const result = await client.images.generations.create({
  model: "gpt-image-2",
  prompt: "A minimalist logo for an AI API platform, flat design, dark background",
  size: "1024x1024",
  quality: "standard",
});

console.log(result.data[0]?.url);
