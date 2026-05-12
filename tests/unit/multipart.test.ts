import { describe, expect, it } from "vitest";
import { buildFormData } from "../../src/core/multipart.js";
import { VeyraError } from "../../src/core/errors.js";

describe("buildFormData", () => {
  it("accepts Buffer input", async () => {
    const form = await buildFormData({ model: "whisper-1", file: Buffer.from("audio") }, "file");

    expect(form.get("model")).toBe("whisper-1");
    expect(form.get("file")).toBeDefined();
  });

  it("accepts Blob input", async () => {
    const form = await buildFormData(
      { model: "whisper-1", file: new Blob(["audio"], { type: "audio/mpeg" }) },
      "file",
    );

    const file = form.get("file") as File;
    expect(file.size).toBeGreaterThan(0);
  });

  it("accepts descriptor input with custom type", async () => {
    const form = await buildFormData(
      {
        model: "whisper-1",
        file: {
          name: "speech.mp3",
          data: Buffer.from("audio"),
          type: "audio/mpeg",
        },
      },
      "file",
    );

    const file = form.get("file") as File;
    expect(file.name).toBe("speech.mp3");
    expect(file.type).toBe("audio/mpeg");
  });

  it("throws on empty file input", async () => {
    await expect(
      buildFormData(
        {
          model: "whisper-1",
          file: Buffer.alloc(0),
        },
        "file",
      ),
    ).rejects.toBeInstanceOf(VeyraError);
  });
});
