# Authentication

The SDK authenticates every API request with a bearer token. For the public SDK surface this is usually a Veyra API key with the `veyra_sk_...` prefix.

Provide an API key using either:

- `VEYRA_API_KEY` environment variable
- `apiKey` constructor option

```ts
import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({ apiKey: "veyra_sk_..." });
```

When `apiKey` is omitted the constructor reads `process.env.VEYRA_API_KEY`. If neither value exists, construction fails immediately with `VeyraAuthenticationError` so a missing secret is detected before any network call.

```ts
import { Veyra, VeyraAuthenticationError } from "@tubox/veyra-sdk";

try {
  const client = new Veyra();
  await client.models.list();
} catch (error) {
  if (error instanceof VeyraAuthenticationError) {
    console.error("Set VEYRA_API_KEY or pass apiKey explicitly.");
  }
}
```

## Base URL

The default API origin is `https://veyra.tubox.cloud`. Override it globally for staging or local test environments:

```ts
const client = new Veyra({
  apiKey: process.env.VEYRA_API_KEY,
  baseURL: process.env.VEYRA_BASE_URL,
});
```

Per-request `baseURL` is also supported:

```ts
await client.health.ready({ baseURL: "https://staging.veyra.example" });
```

## Headers

Use `defaultHeaders` for headers applied to every request and request options for one-off headers:

```ts
const client = new Veyra({
  apiKey: process.env.VEYRA_API_KEY,
  defaultHeaders: { "X-App": "billing-worker" },
});

await client.models.list({
  headers: { "X-Request-ID": "req_manual_trace_1" },
});
```

The SDK always writes `Authorization: Bearer <apiKey>`. JSON requests use `Content-Type: application/json`; multipart uploads let the runtime set the boundary.
