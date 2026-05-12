import { describe, expect, it } from "vitest";
import { VeyraError } from "../../src/core/errors.js";
import { completionsFixture } from "../helpers/fixtures/index.js";
import { errorBody, getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("completions integration", () => {
  it("creates a legacy completion", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: completionsFixture }]);

    const result = await client.completions.create({
      model: "gpt-5.4-mini",
      prompt: "hello",
    });

    expect(result.choices[0]?.text).toContain("Legacy");

    const { url, init } = getCall(mockFetch);
    expect(url).toContain("/v1/completions");
    expect(init.method).toBe("POST");

    const body = parseJSONBody(init);
    expect(body.prompt).toBe("hello");
  });

  it("rejects multi prompt arrays client-side", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: completionsFixture }]);

    await expect(
      client.completions.create({
        model: "gpt-5.4-mini",
        prompt: ["a", "b"],
      }),
    ).rejects.toBeInstanceOf(VeyraError);

    expect(mockFetch).toHaveBeenCalledTimes(0);
  });

  it("retries transient responses", async () => {
    const { client, mockFetch } = makeClient([
      { status: 500, body: errorBody("server_error") },
      { status: 500, body: errorBody("server_error") },
      { status: 200, body: completionsFixture },
    ]);

    await client.completions.create({ model: "gpt-5.4-mini", prompt: "retry" });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
