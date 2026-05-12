import { describe, expect, it } from "vitest";
import { responsesFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("responses integration", () => {
  it("creates a response", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: responsesFixture }]);

    const result = await client.responses.create({
      model: "gpt-5.4-mini",
      input: "hello",
    });

    expect(result.output[0]?.content[0]?.text).toBe("Response output");

    const { url, init } = getCall(mockFetch);
    expect(url).toContain("/v1/responses");
    expect(init.method).toBe("POST");

    const body = parseJSONBody(init);
    expect(body.input).toBe("hello");
  });
});
