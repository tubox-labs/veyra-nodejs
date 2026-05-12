# Veyra Node.js SDK

[![npm version](https://img.shields.io/npm/v/@tubox/veyra-sdk.svg)](https://www.npmjs.com/package/@tubox/veyra-sdk)
[![Node.js](https://img.shields.io/node/v/@tubox/veyra-sdk.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/npm/l/@tubox/veyra-sdk.svg)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/veyra/veyra-node/ci.yml)](#)

The official Veyra SDK for Node.js and TypeScript. It provides strict typings, streaming via async iterables, built-in retry logic, and resource-based namespaces.

## Installation

```bash
npm install @tubox/veyra-sdk
# pnpm add @tubox/veyra-sdk
# yarn add @tubox/veyra-sdk
```

## Quickstart

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({ apiKey: process.env.VEYRA_API_KEY });

const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(completion.choices[0]?.message.content);
```

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra();
const stream = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [{ role: "user", content: "Count to 5" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta.content ?? "");
}
```

## Authentication

Use either:

- `VEYRA_API_KEY` environment variable.
- Explicit constructor option: `new Veyra({ apiKey: "veyra_sk_..." })`.

## Resources At A Glance

| Namespace | Primary method |
|---|---|
| `chat.completions` | `create()` |
| `completions` | `create()` |
| `responses` | `create()` |
| `embeddings` | `create()` |
| `images.generations` | `create()` |
| `audio.transcriptions` | `create()` |
| `models` | `list()`, `retrieve()` |
| `quota` | `status()`, `listPlans()` |
| `billing.usage` | `list()`, `dailySummary()` |
| `billing.profile` | `retrieve()`, `upsert()` |
| `apiKeys` | `create()`, `list()`, `update()`, `revoke()` |
| `assistant` | `chat()` |
| `health` | `check()`, `ready()` |

## Streaming

Use `for await ... of` on a stream returned from `create({ stream: true })`.

- Early loop breaks are supported.
- Use `stream.toReadableStream()` for edge/browser response piping.

## Pagination

`Page<T>` supports both item iteration and explicit page traversal:

```ts
const page = await client.billing.usage.list({ limit: 50 });
for await (const item of page) {
  console.log(item.id);
}

let current = page;
while (current.hasMore) {
  current = (await current.nextPage())!;
}
```

## Error Handling

```ts
import { VeyraAPIError, VeyraRateLimitError } from "@tubox/veyra-sdk";

try {
  await client.chat.completions.create({ ... });
} catch (error) {
  if (error instanceof VeyraRateLimitError) {
    console.error(error.retryAfter);
  } else if (error instanceof VeyraAPIError) {
    console.error(error.httpStatus, error.code, error.requestId);
  }
}
```

## Retries

Default retries: `2`.

- Configure globally: `new Veyra({ maxRetries: 5 })`
- Configure per request: `client.chat.completions.create(params, { maxRetries: 0 })`

Retryable: network failures, `429`, `500`, `502`, `503`, `504`.

## Timeouts

Default timeout: `60_000` ms.

- Global: `new Veyra({ timeout: 30_000 })`
- Per request: `client.models.list({ timeout: 10_000 })`

## Raw Responses

```ts
const raw = await client.withRawResponse.models.list();
console.log(raw.requestId, raw.httpStatus);
```

## AbortSignal

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 500);
await client.chat.completions.create(params, { signal: controller.signal });
```

## Runtime Compatibility

- Node.js 18+
- Deno
- Bun
- Cloudflare Workers
- Modern browsers

## ESM + CJS

ESM:

```ts
import Veyra from "@tubox/veyra-sdk";
```

CJS:

```js
const { Veyra } = require("@tubox/veyra-sdk");
```

## TypeScript

The SDK is authored with strict TypeScript and exports all public request/response and error types from the package root.

## Docs

See the full docs in [`docs/`](./docs) and generated TypeDoc API reference in `docs/api-reference/`.
Release workflow guidance is documented in [`docs/releasing.md`](./docs/releasing.md).

## Project Policies

- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security](./SECURITY.md)
- [Support](./SUPPORT.md)
- [Release Process](./RELEASE.md)
