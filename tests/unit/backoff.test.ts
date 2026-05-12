import { describe, expect, it, vi } from "vitest";
import { exponentialBackoffWithJitter } from "../../src/core/backoff.js";
import { Veyra } from "../../src/index.js";
import { createMockFetch } from "../helpers/mockFetch.js";

describe("exponentialBackoffWithJitter", () => {
  it("grows exponentially with attempt", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75);

    const a0 = exponentialBackoffWithJitter(0, 500, 2, 0.25, 60_000);
    const a1 = exponentialBackoffWithJitter(1, 500, 2, 0.25, 60_000);

    expect(a1).toBeGreaterThan(a0);
  });

  it("enforces the cap", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const value = exponentialBackoffWithJitter(20, 500, 2, 0.25, 5_000);
    expect(value).toBeLessThanOrEqual(6_250);
  });

  it("keeps jitter within +/-25%", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.49)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(1);

    const base = 1000;
    const lower = exponentialBackoffWithJitter(1, base, 1, 0.25, 10_000);
    const upper = exponentialBackoffWithJitter(1, base, 1, 0.25, 10_000);

    expect(lower).toBeGreaterThanOrEqual(750);
    expect(upper).toBeLessThanOrEqual(1250);
  });

  it("uses Retry-After when provided", async () => {
    const mockFetch = createMockFetch([
      {
        status: 503,
        headers: { "Retry-After": "2" },
        body: { error: { code: "maintenance_mode", message: "wait" } },
      },
      {
        status: 200,
        body: { status: "ok" },
      },
    ]);

    const timeoutSpy = vi.spyOn(globalThis, "setTimeout");

    const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
    await client.health.check();

    const delays = timeoutSpy.mock.calls.map((call) => call[1]);
    expect(delays.some((delay) => delay === 2000)).toBe(true);
  });
});
