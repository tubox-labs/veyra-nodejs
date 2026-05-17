import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: [
    "Veyra is an AI platform.",
    "TypeScript SDKs are useful when public API contracts are explicit.",
  ],
});

for (const item of response.data) {
  console.log(`index=${item.index}  dims=${item.embedding.length}`);
}

console.log("usage", response.usage);
