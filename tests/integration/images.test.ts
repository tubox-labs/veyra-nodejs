import { describe, expect, it } from "vitest";
import { VeyraError } from "../../src/core/errors.js";
import { imagesFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("images integration", () => {
  it("creates images", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: imagesFixture }]);

    const result = await client.images.generations.create({
      model: "gpt-image-2",
      prompt: "logo",
      size: "1024x1024",
      quality: "standard",
      responseFormat: "url",
    });

    expect(result.data[0]?.url).toContain("image.png");
    const { init } = getCall(mockFetch);
    const body = parseJSONBody(init);
    expect(body.response_format).toBe("url");
  });

  it("validates image params client-side", async () => {
    const { client } = makeClient([{ status: 200, body: imagesFixture }]);

    await expect(
      client.images.generations.create({
        model: "gpt-image-2",
        prompt: "logo",
        n: 11,
      }),
    ).rejects.toBeInstanceOf(VeyraError);
  });
});
