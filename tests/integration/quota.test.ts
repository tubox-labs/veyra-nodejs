import { describe, expect, it } from "vitest";
import { quotaFixture } from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("quota integration", () => {
  it("returns quota status and plans", async () => {
    const plans = [{ id: "pro", name: "Pro", tier: "pro", is_public: true, limits: quotaFixture.limits }];
    const { client } = makeClient([
      { status: 200, body: quotaFixture },
      { status: 200, body: plans },
      { status: 200, body: plans },
    ]);

    const status = await client.quota.status();
    expect(status.usage.tokensUsedToday).toBe(5000);

    const privatePlans = await client.quota.listPlans();
    expect(privatePlans[0]?.isPublic).toBe(true);

    const publicPlans = await client.quota.listPublicPlans();
    expect(publicPlans).toHaveLength(1);
  });
});
