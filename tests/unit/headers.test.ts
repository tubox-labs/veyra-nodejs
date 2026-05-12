import { describe, expect, it } from "vitest";
import { buildHeaders, mergeHeaders } from "../../src/core/headers.js";
import { VERSION } from "../../src/version.js";

describe("headers", () => {
  it("merges headers with later sources taking precedence", () => {
    const merged = mergeHeaders({ A: "1", B: "1" }, { B: "2" }, { C: "3" });
    expect(merged).toEqual({ A: "1", B: "2", C: "3" });
  });

  it("injects auth and user-agent", () => {
    const headers = buildHeaders({ apiKey: "veyra_sk_test" });
    expect(headers.Authorization).toBe("Bearer veyra_sk_test");
    expect(headers["User-Agent"]).toContain(`veyra-node/${VERSION}`);
  });

  it("request headers override defaults", () => {
    const headers = buildHeaders({
      apiKey: "veyra_sk_test",
      defaultHeaders: { "X-Test": "default" },
      requestHeaders: { "X-Test": "request" },
      hasBody: true,
    });

    expect(headers["X-Test"]).toBe("request");
    expect(headers["Content-Type"]).toBe("application/json");
  });
});
