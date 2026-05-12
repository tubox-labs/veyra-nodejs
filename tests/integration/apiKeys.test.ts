import { describe, expect, it } from "vitest";
import { apiKeysFixture } from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("apiKeys integration", () => {
  it("supports create/list/update/revoke", async () => {
    const createResponse = {
      id: "key_2",
      key: "veyra_sk_full_value",
      name: "ci",
      scopes: ["chat:write"],
      created_at: "2026-05-12T00:00:00Z",
    };

    const updated = {
      ...apiKeysFixture[0],
      name: "ci-updated",
    };

    const { client } = makeClient([
      { status: 200, body: createResponse },
      { status: 200, body: apiKeysFixture },
      { status: 200, body: updated },
      { status: 204, body: null },
    ]);

    const created = await client.apiKeys.create({ name: "ci", scopes: ["chat:write"] });
    expect(created.key).toContain("veyra_sk_");

    const listed = await client.apiKeys.list();
    expect(listed[0]?.isActive).toBe(true);

    const result = await client.apiKeys.update("key_1", { name: "ci-updated" });
    expect(result.name).toBe("ci-updated");

    await expect(client.apiKeys.revoke("key_1")).resolves.toBeUndefined();
  });
});
