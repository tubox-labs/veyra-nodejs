import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();
const status = await client.quota.status();

console.log(`Plan:             ${status.plan}`);
console.log(`Requests today:   ${status.usage.requestsUsedToday}/${status.limits.dailyRequests}`);
console.log(`Tokens today:     ${status.usage.tokensUsedToday}/${status.limits.dailyTokens}`);
console.log(`RPM/TPM:          ${status.limits.rpm}/${status.limits.tpm}`);
console.log(`Context/output:   ${status.limits.maxContextTokens}/${status.limits.maxOutputTokens}`);
console.log(`Resets at:        ${status.resetsAt}`);
console.log(`Reset countdown:  ${status.timeUntilReset ?? "unknown"}`);

const plans = await client.quota.listPublicPlans();
for (const plan of plans) {
  console.log(`${plan.name}: ${plan.limits.dailyRequests} requests/day`);
}
