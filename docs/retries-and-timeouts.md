# Retries and Timeouts

Defaults:

- `maxRetries`: `2`
- `timeout`: `60_000ms`

Retryable: network failures and HTTP `429/500/502/503/504`.

Per-request overrides:

```ts
await client.models.list({ timeout: 10_000, maxRetries: 0 });
```
