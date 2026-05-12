import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

for await (const record of await client.billing.usage.list({ limit: 50 })) {
  const ts = record.createdAt;
  console.log(
    `${ts}  ${record.model.padEnd(24)}  ${String(record.totalTokens).padStart(8)} tokens  ${record.statusCode}`,
  );
}
