import { describe, expect, it } from "vitest";
import {
  attachRaw,
  parseJsonWithCamelCase,
  strip,
  toCamelCase,
  toSnakeCase,
  toQueryParams,
} from "../../src/lib/typeUtils.js";

describe("type utilities", () => {
  it("strips undefined values recursively without removing nulls", () => {
    const value = strip({
      keep: "yes",
      remove: undefined,
      nested: {
        keepNull: null,
        removeNested: undefined,
      },
      list: [{ remove: undefined, keep: 1 }],
    });

    expect(value).toEqual({
      keep: "yes",
      nested: { keepNull: null },
      list: [{ keep: 1 }],
    });
  });

  it("converts object keys recursively without transforming special runtime objects", () => {
    const date = new Date("2026-05-17T00:00:00Z");
    const snake = toSnakeCase({
      maxOutputTokens: 12,
      nestedValue: [{ responseFormat: { jsonSchema: { name: "schema" } } }],
      createdAt: date,
    });

    expect(snake).toEqual({
      max_output_tokens: 12,
      nested_value: [{ response_format: { json_schema: { name: "schema" } } }],
      created_at: date,
    });

    expect(toCamelCase(snake)).toEqual({
      maxOutputTokens: 12,
      nestedValue: [{ responseFormat: { jsonSchema: { name: "schema" } } }],
      createdAt: date,
    });
  });

  it("builds query params with snake_case keys and string values", () => {
    const params = toQueryParams({
      maxOutputTokens: 10,
      includeUsage: true,
      omitted: undefined,
    });

    expect(params.get("max_output_tokens")).toBe("10");
    expect(params.get("include_usage")).toBe("true");
    expect(params.has("omitted")).toBe(false);
  });

  it("attaches raw payloads as non-enumerable metadata", () => {
    const data = { value: 1 };
    const raw = { value: 1 };
    const result = attachRaw(data, raw) as typeof data & { _raw: unknown };

    expect(result._raw).toBe(raw);
    expect(Object.keys(result)).toEqual(["value"]);
  });

  it("parses JSON and camel-cases nested response payloads", () => {
    const parsed = parseJsonWithCamelCase<{
      outputTokensDetails: { reasoningTokens: number };
      _raw?: unknown;
    }>('{"output_tokens_details":{"reasoning_tokens":7}}');

    expect(parsed.outputTokensDetails.reasoningTokens).toBe(7);
    expect(parsed._raw).toEqual({ output_tokens_details: { reasoning_tokens: 7 } });
  });
});
