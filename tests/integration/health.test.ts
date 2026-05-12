import { describe, expect, it, vi } from "vitest";
import { healthFixture } from "../helpers/fixtures/index.js";
import { errorBody, makeClient } from "./_shared.js";

describe("health integration", () => {
  it("checks health and readiness", async () => {
    const { client } = makeClient([
      { status: 200, body: healthFixture },
      { status: 200, body: { ready: true, checks: { db: "ok" } } },
    ]);

    const health = await client.health.check();
    expect(health.status).toBe("ok");

    const ready = await client.health.ready();
    expect(ready.ready).toBe(true);
  });

  it("retries 503s until success", async () => {
    const timeoutSpy = vi.spyOn(globalThis, "setTimeout");

    const { client, mockFetch } = makeClient([
      { status: 503, body: errorBody("provider_unavailable") },
      { status: 503, body: errorBody("provider_unavailable") },
      { status: 200, body: healthFixture },
    ]);

    const result = await client.health.check();
    expect(result.status).toBe("ok");
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(timeoutSpy).toHaveBeenCalled();
  });
});
