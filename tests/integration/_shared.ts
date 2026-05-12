import { Veyra } from "../../src/index.js";
import { createMockFetch, type MockFetchResponse } from "../helpers/mockFetch.js";

export function makeClient(responses: MockFetchResponse[]) {
  const mockFetch = createMockFetch(responses);
  const client = new Veyra({ apiKey: "veyra_sk_test", fetch: mockFetch as typeof fetch });
  return { client, mockFetch };
}

export function getCall(
  mockFetch: ReturnType<typeof createMockFetch>,
  callIndex = 0,
): { url: string; init: RequestInit } {
  const call = mockFetch.mock.calls[callIndex];
  if (!call) {
    throw new Error(`Expected call index ${callIndex} to exist.`);
  }

  return {
    url: String(call[0]),
    init: (call[1] ?? {}) as RequestInit,
  };
}

export function parseJSONBody(init: RequestInit): Record<string, unknown> {
  const raw = init.body as string;
  return JSON.parse(raw) as Record<string, unknown>;
}

export function errorBody(code: string, message = "error") {
  return {
    error: {
      code,
      message,
    },
  };
}
