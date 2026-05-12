import { describe, expect, it } from "vitest";
import { audioFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient } from "./_shared.js";

describe("audio integration", () => {
  it("uploads multipart transcriptions", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: audioFixture }]);

    const result = await client.audio.transcriptions.create({
      model: "whisper-1",
      file: {
        name: "speech.mp3",
        data: Buffer.from("audio"),
        type: "audio/mpeg",
      },
    });

    expect(result.text).toBe("transcribed text");

    const { init } = getCall(mockFetch);
    const headers = init.headers as Record<string, string>;
    const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
    expect(hasContentType).toBe(false);
    expect(init.body instanceof FormData).toBe(true);
  });
});
