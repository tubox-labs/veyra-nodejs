import { describe, expect, it } from "vitest";
import { responsesFixture } from "../helpers/fixtures/index.js";
import { getCall, makeClient, parseJSONBody } from "./_shared.js";

describe("responses integration", () => {
  it("creates a response", async () => {
    const { client, mockFetch } = makeClient([{ status: 200, body: responsesFixture }]);

    const result = await client.responses.create({
      model: "gpt-5.4-mini",
      input: "hello",
      instructions: "Be concise",
      maxOutputTokens: 128,
      reasoning: { effort: "medium", summary: "auto" },
      parallelToolCalls: true,
      truncation: "auto",
      responseFormat: { type: "json_object" },
    });

    const reasoning = result.output.find((item) => item.type === "reasoning");
    expect(reasoning?.type).toBe("reasoning");
    const output = result.output.find((item) => item.type === "message");
    if (!output || output.type !== "message") {
      throw new Error("Expected message output");
    }
    expect(output.content[0]?.text).toBe("Response output");
    expect(result.createdAt).toBe(1710000000);
    expect(result.parallelToolCalls).toBe(true);
    expect(result.usage?.inputTokensDetails?.cachedTokens).toBe(1);
    expect(result.usage?.outputTokensDetails?.reasoningTokens).toBe(2);

    const { url, init } = getCall(mockFetch);
    expect(url).toContain("/v1/responses");
    expect(init.method).toBe("POST");

    const body = parseJSONBody(init);
    expect(body.input).toBe("hello");
    expect(body.instructions).toBe("Be concise");
    expect(body.max_output_tokens).toBe(128);
    expect(body.reasoning).toEqual({ effort: "medium", summary: "auto" });
    expect(body.parallel_tool_calls).toBe(true);
    expect(body.truncation).toBe("auto");
    expect(body.response_format).toEqual({ type: "json_object" });
  });
});
