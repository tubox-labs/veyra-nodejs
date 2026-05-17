import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();

const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const usage = await client.billing.usage.list({ since, limit: 50 });

for await (const record of usage) {
  const ts = record.createdAt;
  console.log(
    `${ts}  ${record.model.padEnd(24)}  ${String(record.totalTokens).padStart(8)} tokens  ${record.statusCode}`,
  );
}

const daily = await client.billing.usage.dailySummary();
console.log("daily", {
  requests: daily.requestCount,
  promptTokens: daily.promptTokens,
  completionTokens: daily.completionTokens,
  totalTokens: daily.totalTokens,
  cost: daily.totalCostUsd,
});

const now = new Date();
const monthly = await client.billing.usage.monthlySummary({
  year: now.getUTCFullYear(),
  month: now.getUTCMonth() + 1,
});
console.log("monthly", monthly);
