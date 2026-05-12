import { describe, expect, it } from "vitest";
import { VeyraError } from "../../src/core/errors.js";
import { embeddingsFixture } from "../helpers/fixtures/index.js";
import { makeClient } from "./_shared.js";

describe("embeddings integration", () => {
  it("creates embeddings", async () => {
    const { client } = makeClient([{ status: 200, body: embeddingsFixture }]);

    const result = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: ["one", "two"],
    });

    expect(result.data[0]?.embedding.length).toBe(3);
    expect(result.usage?.totalTokens).toBe(2);
  });

  it("validates local input constraints", async () => {
    const { client } = makeClient([{ status: 200, body: embeddingsFixture }]);

    await expect(
      client.embeddings.create({
        model: "text-embedding-3-small",
        input: [],
      }),
    ).rejects.toBeInstanceOf(VeyraError);
  });
});
