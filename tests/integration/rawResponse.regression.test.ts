import { describe, expect, it } from "vitest";
import { modelsFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient } from "./_shared.js";

describe("raw response regressions", () => {
  it("returns metadata while preserving camel-cased data", async () => {
    const { client, mockFetch } = makeClient([
      {
        status: 200,
        body: modelsFixture,
        headers: { "X-Request-ID": "req_raw_1", "X-Custom": "present" },
      },
    ]);

    const response = await client.withRawResponse.models.list({
      headers: { "X-Trace": "trace_1" },
    });

    expect(response.httpStatus).toBe(200);
    expect(response.requestId).toBe("req_raw_1");
    expect(response.headers.get("X-Custom")).toBe("present");
    expect(response.data.data[0]?.ownedBy).toBe("veyra");

    const { init } = getCall(mockFetch);
    expect((init.headers as Record<string, string>)["X-Trace"]).toBe("trace_1");
  });
});
