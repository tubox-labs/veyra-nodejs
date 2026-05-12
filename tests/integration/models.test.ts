import { describe, expect, it } from "vitest";
import { modelsFixture } from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("models integration", () => {
  it("lists and retrieves models", async () => {
    const { client } = makeClient([
      { status: 200, body: modelsFixture },
      { status: 200, body: modelsFixture.data[0] },
    ]);

    const list = await client.models.list();
    expect(list.data[0]?.ownedBy).toBe("veyra");

    const model = await client.models.retrieve("gpt-5.4-mini");
    expect(model.id).toBe("gpt-5.4-mini");
  });
});
