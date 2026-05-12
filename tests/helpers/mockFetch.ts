import { vi } from "vitest";

export interface MockFetchResponse {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

/**
 * Create a `fetch` spy that returns a pre-configured sequence of responses.
 */
export function createMockFetch(responses: MockFetchResponse[]) {
  let index = 0;

  const mock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
    void _input;
    void _init;
    if (responses.length === 0) {
      throw new Error("createMockFetch requires at least one response.");
    }

    const current = responses[Math.min(index, responses.length - 1)] as MockFetchResponse;
    index += 1;

    const headers = new Headers({ "Content-Type": "application/json", ...current.headers });

    return new Response(
      current.body === undefined || current.body === null
        ? null
        : typeof current.body === "string"
          ? current.body
          : JSON.stringify(current.body),
      {
        status: current.status,
        headers,
      },
    );
  });

  return mock;
}
