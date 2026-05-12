import { describe, expect, it } from "vitest";
import {
  billingFixture,
  billingUsagePage1Fixture,
  billingUsagePage2Fixture,
} from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("billing integration", () => {
  it("auto-paginates usage and handles profile endpoints", async () => {
    const profile = {
      id: "bp_1",
      organization_name: "Veyra",
      contact_name: "Ops",
      contact_email: "ops@veyra.ai",
      country: "IN",
    };

    const access = { has_access: true };

    const { client } = makeClient([
      { status: 200, body: billingUsagePage1Fixture },
      { status: 200, body: billingUsagePage2Fixture },
      { status: 200, body: billingFixture },
      { status: 200, body: billingFixture },
      { status: 200, body: profile },
      { status: 200, body: profile },
      { status: 200, body: access },
    ]);

    const usagePage = await client.billing.usage.list({ limit: 1 });
    const ids: string[] = [];
    for await (const item of usagePage) {
      ids.push(item.id);
    }
    expect(ids).toEqual(["u_1", "u_2"]);

    const day = await client.billing.usage.dailySummary();
    expect(day.totalRequests).toBe(200);

    const month = await client.billing.usage.monthlySummary({ year: 2026, month: 5 });
    expect(month.totalTokens).toBe(12000);

    const retrieved = await client.billing.profile.retrieve();
    expect(retrieved?.organizationName).toBe("Veyra");

    const upserted = await client.billing.profile.upsert({
      organizationName: "Veyra",
      contactName: "Ops",
      contactEmail: "ops@veyra.ai",
      country: "IN",
    });
    expect(upserted.id).toBe("bp_1");

    const accessResult = await client.billing.profile.access();
    expect(accessResult.hasAccess).toBe(true);
  });
});
