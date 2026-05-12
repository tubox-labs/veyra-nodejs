import Veyra from "veyra";

const client = new Veyra();
const status = await client.quota.status();

console.log(`Plan:             ${status.plan}`);
console.log(`Requests today:   ${status.usage.requestsUsedToday}/${status.limits.dailyRequests}`);
console.log(`Tokens today:     ${status.usage.tokensUsedToday}/${status.limits.dailyTokens}`);
console.log(`Resets at:        ${status.resetsAt}`);
