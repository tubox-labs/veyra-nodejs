import Veyra from "veyra";

const client = new Veyra();

const created = await client.apiKeys.create({
  name: "ci-automation",
  scopes: ["chat:read", "chat:write"],
  expiresInDays: 30,
});
console.log("Created:", created.key);

const keys = await client.apiKeys.list();
for (const key of keys) {
  console.log(key.id, key.name, `active=${key.isActive}`);
}

await client.apiKeys.revoke(created.id);
console.log("Revoked.");
