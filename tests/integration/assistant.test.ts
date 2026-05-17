import { describe, expect, it } from "vitest";
import { assistantFixture } from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("assistant integration", () => {
  it("chats with assistant", async () => {
    const { client } = makeClient([{ status: 200, body: assistantFixture }]);

    const result = await client.assistant.chat({
      message: "hello",
      history: [{ role: "user", content: "previous" }],
    });

    expect(result.answer).toBe("Assistant reply");
    expect(result.model).toBe("account-context");
    expect(result.requiresLogin).toBe(false);
  });
});
