# Retries and Timeouts

Defaults:

- `maxRetries`: `2`
- `timeout`: `60_000ms`

Retryable: network failures and HTTP `429/500/502/503/504`.

Per-request overrides:

```ts
await client.models.list({ timeout: 10_000, maxRetries: 0 });
```

## Global configuration

```ts
const client = new Veyra({
  apiKey: process.env.VEYRA_API_KEY,
  timeout: 30_000,
  maxRetries: 4,
});
```

## Retry delay

The SDK honors `Retry-After` when it is present and numeric. Otherwise it uses exponential backoff with jitter. Caller-aborted requests are not retried.

## AbortSignal

```ts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 1_000);

try {
  await client.chat.completions.create(
    {
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "Long task" }],
    },
    { signal: controller.signal },
  );
} finally {
  clearTimeout(timeout);
}
```

SDK timeouts throw `VeyraAPITimeoutError`. Caller aborts throw `VeyraAPIConnectionAbortedError`.
