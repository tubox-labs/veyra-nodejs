# SDK API Reference

This reference describes the public behavior implemented by the Veyra Node.js SDK. It is written from the SDK source in `src/`, not from inferred backend behavior. Generated TypeDoc pages live beside this file and document every exported interface, class, and type alias.

## Client Construction

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({
  apiKey: process.env.VEYRA_API_KEY,
  baseURL: "https://veyra.tubox.cloud",
  timeout: 60_000,
  maxRetries: 2,
  defaultHeaders: { "X-App": "worker" },
});
```

`apiKey` defaults to `VEYRA_API_KEY`. `baseURL` defaults to `VEYRA_BASE_URL` and then `https://veyra.tubox.cloud`. The constructor throws `VeyraAuthenticationError` when no API key is available.

All JSON request keys are accepted in camelCase by the SDK and serialized to snake_case before dispatch. JSON response keys are converted back to camelCase. The original parsed response payload is attached as a non-enumerable `_raw` property when the response body is an object or array.

## Request Options

Every resource method accepts an optional second argument:

```ts
await client.chat.completions.create(params, {
  timeout: 15_000,
  maxRetries: 0,
  signal: abortController.signal,
  headers: { "X-Request-ID": "req_local_123" },
  baseURL: "https://staging.example.com",
});
```

Request headers merge in this order: SDK defaults, per-request headers, and SDK-managed `Authorization` / JSON content headers. Multipart requests remove `Content-Type` so the runtime can add the correct boundary.

## Raw Responses

`client.withRawResponse` returns a cloned client whose non-streaming methods resolve to `APIResponse<T>` wrappers:

```ts
const raw = await client.withRawResponse.models.list();
console.log(raw.httpStatus, raw.requestId, raw.data.data.length);
```

Streaming overloads still return `Stream<T>`.

## Resource Map

| SDK namespace | Method | HTTP route |
|---|---|---|
| `client.chat.completions` | `create()` | `POST /v1/chat/completions` |
| `client.completions` | `create()` | `POST /v1/completions` |
| `client.responses` | `create()` | `POST /v1/responses` |
| `client.embeddings` | `create()` | `POST /v1/embeddings` |
| `client.images.generations` | `create()` | `POST /v1/images/generations` |
| `client.audio.transcriptions` | `create()` | `POST /v1/audio/transcriptions` |
| `client.models` | `list()`, `retrieve(id)` | `GET /v1/models`, `GET /v1/models/{id}` |
| `client.quota` | `status()`, `listPlans()`, `listPublicPlans()` | `/v1/quota/*` |
| `client.billing.usage` | `list()`, `dailySummary()`, `monthlySummary()` | `/v1/billing/usage*` |
| `client.billing.profile` | `retrieve()`, `upsert()`, `access()` | `/v1/billing/profile`, `/v1/billing/access` |
| `client.apiKeys` | `create()`, `list()`, `update()`, `revoke()` | `/v1/api-keys*` |
| `client.assistant` | `chat()` | `POST /v1/assistant/chat` |
| `client.health` | `check()`, `ready()` | `/health`, `/health/ready` |

## Chat Completions

```ts
const completion = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [
    { role: "system", content: "Be concise." },
    { role: "user", content: "Summarize token quotas." },
  ],
  maxCompletionTokens: 256,
  reasoning: { effort: "low", summary: "auto" },
  responseFormat: { type: "text" },
});
```

Supported message roles are `system`, `user`, and `assistant`. `maxCompletionTokens`, `topP`, `frequencyPenalty`, `presencePenalty`, `reasoningEffort`, `reasoning`, `responseFormat`, and `user` are serialized to backend-compatible snake_case keys. Streaming returns `Stream<ChatCompletionChunk>` and each chunk is camel-cased before yield.

## Legacy Text Completions

```ts
const completion = await client.completions.create({
  model: "gpt-5.4-mini",
  prompt: "Write a short release note.",
  maxTokens: 128,
});
```

The SDK rejects prompt arrays with more than one item before dispatch because the backend implementation only accepts one prompt. Streaming returns `Stream<TextCompletionChunk>`.

## Responses API

```ts
const response = await client.responses.create({
  model: "gpt-5.4-mini",
  input: [
    {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: "Explain the SDK retry model." }],
    },
  ],
  instructions: "Answer for a TypeScript engineer.",
  maxOutputTokens: 300,
  reasoning: { effort: "medium", summary: "auto" },
  parallelToolCalls: false,
  truncation: "auto",
});
```

`input` can be a string, one message object, or an array of strings/message items/input text items. `output` can include reasoning items before message items, so consumers should search by `item.type === "message"` rather than assuming `output[0]` contains text.

```ts
const message = response.output.find((item) => item.type === "message");
const text = message?.type === "message" ? message.content.map((part) => part.text).join("") : "";
```

Usage may be reported with either chat-style token keys (`promptTokens`, `completionTokens`) or Responses-style token keys (`inputTokens`, `outputTokens`) plus detail objects such as `inputTokensDetails.cachedTokens` and `outputTokensDetails.reasoningTokens`.

## Streaming

Streaming methods return `Stream<T>`, an async iterable over Server-Sent Events. The parser:

- consumes `data: ...` lines.
- stops on `data: [DONE]`.
- maps JSON error envelopes into SDK error subclasses.
- prevents double consumption by throwing `VeyraStreamConsumedError`.
- exposes `toReadableStream()` for direct runtime piping.

```ts
const stream = await client.responses.create({
  model: "gpt-5.4-mini",
  input: "Say hello.",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta ?? "");
  }
}
```

## Embeddings

```ts
const embeddings = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: ["first text", "second text"],
});
```

The SDK validates embedding input before sending: strings are limited to 30,000 characters, arrays must contain 1 to 256 items, and each array item is limited to 30,000 characters.

## Images

```ts
const image = await client.images.generations.create({
  model: "gpt-image-2",
  prompt: "A precise product icon for an API SDK.",
  n: 1,
  size: "1024x1024",
  quality: "standard",
  responseFormat: "url",
});
```

Client-side validation enforces `n` between 1 and 10, `size` in `1024x1024`, `1024x1792`, or `1792x1024`, and `quality` as `standard` or `hd`.

## Audio Transcriptions

```ts
import { readFile } from "node:fs/promises";

const file = await readFile("meeting.mp3");
const transcript = await client.audio.transcriptions.create({
  model: "whisper-1",
  file: { name: "meeting.mp3", data: file, type: "audio/mpeg" },
  language: "en",
});
```

`file` can be a `Blob`, `Buffer`, `ReadableStream<Uint8Array>`, or descriptor object with `name`, `data`, and optional `type`. Empty and unsupported uploads are rejected before dispatch.

## Pagination

`client.billing.usage.list()` returns `Page<UsageRecord>`.

```ts
const first = await client.billing.usage.list({ limit: 100 });

for await (const record of first) {
  console.log(record.createdAt, record.model, record.totalTokens);
}

for await (const page of first.iterPages()) {
  console.log("page", page.offset, page.items.length);
}
```

The next offset is computed as `offset + items.length`, matching the backend's offset/limit pagination shape.

## Error Mapping

| Status / code | Error class |
|---|---|
| `400` | `VeyraBadRequestError` |
| `400 payload_too_large` | `VeyraPayloadTooLargeError` |
| `401` | `VeyraAuthenticationError` |
| `402` | `VeyraBillingRequiredError` |
| `403` | `VeyraPermissionDeniedError` |
| `403 model_not_available` | `VeyraModelNotAvailableError` |
| `404` | `VeyraNotFoundError` |
| `409` | `VeyraConflictError` |
| `422` | `VeyraUnprocessableEntityError` with `details` |
| `429` | `VeyraRateLimitError` with `retryAfter` |
| `500` | `VeyraInternalServerError` |
| `502`, `503` | `VeyraProviderUnavailableError` |
| `503 maintenance_mode` | `VeyraMaintenanceModeError` |

Network failures are wrapped as `VeyraAPIConnectionError`. Caller aborts become `VeyraAPIConnectionAbortedError`; SDK timeouts become `VeyraAPITimeoutError`.

## Retry Behavior

Default retry count is 2. The SDK retries network failures and HTTP `429`, `500`, `502`, `503`, and `504`, unless the request has been explicitly aborted or the retry budget is exhausted. `Retry-After` is honored when present; otherwise exponential backoff with jitter is used.

## API Key Management

```ts
const created = await client.apiKeys.create({
  name: "ci",
  scopes: ["chat:read", "chat:write"],
  expiresInDays: 30,
});

await client.apiKeys.update(created.id, { name: "ci-rotated" });
await client.apiKeys.revoke(created.id);
```

The secret key value is returned only by `create()`. `update()` and `revoke()` URL-encode the API key id.

