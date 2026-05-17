# Testing Guide

The test suite is split into unit tests for SDK internals and integration-style tests using a mocked `fetch` implementation. No normal test reaches the live Veyra API.

## Commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run docs
```

`npm run ci:all` runs the full local quality gate.

## Live Smoke Tests

The live smoke test is opt-in and requires `VEYRA_API_KEY`.

```bash
VEYRA_API_KEY=veyra_sk_... npm run smoke:live
```

It checks:

- `/health`
- `/v1/models`
- non-streaming chat completions
- Responses API with reasoning controls
- streaming chat completions

## What The Regression Tests Cover

- JSON request body serialization from camelCase SDK fields to snake_case backend fields.
- JSON response and stream event conversion back to camelCase.
- retry and timeout behavior in `VeyraClient`.
- error-envelope mapping into SDK error subclasses.
- one-shot stream consumption and streamed error propagation.
- embedding, image, and audio client-side validation.
- pagination page and item iteration.
- billing endpoint paths from the implementation-aware backend reference.
- Responses API reasoning output ordering, including reasoning items before message items.

## Mock Fetch Pattern

Tests use `tests/helpers/mockFetch.ts`:

```ts
const { client, mockFetch } = makeClient([
  { status: 200, body: { object: "list", data: [] } },
]);

await client.models.list();
expect(mockFetch).toHaveBeenCalledOnce();
```

Use `parseJSONBody(init)` for request-body assertions and `buildSSEStream()` for streaming fixtures.

