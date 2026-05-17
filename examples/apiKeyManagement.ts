import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const created = await client.apiKeys.create({
  name: "ci-automation",
  scopes: ["chat:read", "chat:write", "embeddings:read"],
  expiresInDays: 30,
});
console.log("Created:", created.key);

const updated = await client.apiKeys.update(created.id, {
  name: "ci-automation-rotated",
  scopes: ["chat:read", "chat:write"],
});
console.log("Updated:", updated.name, updated.scopes);

const keys = await client.apiKeys.list();
for (const key of keys) {
  console.log(key.id, key.name, `active=${key.isActive}`, `lastUsed=${key.lastUsedAt ?? "never"}`);
}

await client.apiKeys.revoke(created.id);
console.log("Revoked.");
