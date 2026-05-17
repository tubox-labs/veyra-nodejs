import { describe, expect, it } from "vitest";
import {
  billingFixture,
  billingUsagePage1Fixture,
  billingUsagePage2Fixture,
} from "../helpers/fixtures/index.js";
import { getCall, makeClient } from "./_shared.js";

describe("billing integration", () => {
  it("auto-paginates usage and handles profile endpoints", async () => {
    const profile = {
      billing_email: "billing@veyra.ai",
      full_name: "Ops",
      company_name: "Veyra",
      country_code: "IN",
      line1: "Main St",
      city: "Bengaluru",
      state_region: "KA",
      postal_code: "560001",
    };

    const access = {
      plan: "free",
      billing_required: true,
      can_use_models: false,
      reason: "Add billing profile details to unlock model usage on Free tier",
    };

    const { client, mockFetch } = makeClient([
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
    expect(day.requestCount).toBe(200);

    const month = await client.billing.usage.monthlySummary({ year: 2026, month: 5 });
    expect(month.totalTokens).toBe(12000);

    const retrieved = await client.billing.profile.retrieve();
    expect(retrieved?.billingEmail).toBe("billing@veyra.ai");

    const upserted = await client.billing.profile.upsert({
      billingEmail: "billing@veyra.ai",
      fullName: "Ops",
      companyName: "Veyra",
      countryCode: "IN",
      line1: "Main St",
      city: "Bengaluru",
      stateRegion: "KA",
      postalCode: "560001",
    });
    expect(upserted.companyName).toBe("Veyra");

    const accessResult = await client.billing.profile.access();
    expect(accessResult.canUseModels).toBe(false);

    expect(getCall(mockFetch, 2).url).toContain("/v1/billing/usage/summary/daily");
    expect(getCall(mockFetch, 3).url).toContain("/v1/billing/usage/summary/monthly");
    expect(getCall(mockFetch, 6).url).toContain("/v1/billing/access");
  });
});
