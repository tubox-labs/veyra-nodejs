# Error Handling

All SDK errors extend `VeyraError`. API responses with the standard backend error envelope are mapped to the most specific subclass the SDK can infer from HTTP status and `error.code`.

- API errors: `VeyraAPIError` and subclasses.
- Connection errors: `VeyraAPIConnectionError`, `VeyraAPITimeoutError`.

```ts
import {
  VeyraAPIConnectionError,
  VeyraAPIError,
  VeyraRateLimitError,
  VeyraUnprocessableEntityError,
} from "@tubox/veyra-sdk";

try {
  await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: "Hello" }],
  });
} catch (error) {
  if (error instanceof VeyraRateLimitError) {
    console.error(error.retryAfter);
  } else if (error instanceof VeyraUnprocessableEntityError) {
    console.error(error.details);
  } else if (error instanceof VeyraAPIError) {
    console.error(error.httpStatus, error.code, error.requestId);
  } else if (error instanceof VeyraAPIConnectionError) {
    console.error(error.cause);
  }
}
```

## Error Class Mapping

| Status / code | Class |
|---|---|
| `400` | `VeyraBadRequestError` |
| `400 payload_too_large` | `VeyraPayloadTooLargeError` |
| `401` | `VeyraAuthenticationError` |
| `402` | `VeyraBillingRequiredError` |
| `403` | `VeyraPermissionDeniedError` |
| `403 model_not_available` | `VeyraModelNotAvailableError` |
| `404` | `VeyraNotFoundError` |
| `409` | `VeyraConflictError` |
| `422` | `VeyraUnprocessableEntityError` |
| `429` | `VeyraRateLimitError` |
| `500` | `VeyraInternalServerError` |
| `502` | `VeyraProviderUnavailableError` |
| `503 maintenance_mode` | `VeyraMaintenanceModeError` |
| `503` | `VeyraProviderUnavailableError` |

`VeyraAPIError` exposes:

- `httpStatus`
- `code`
- `requestId`
- `headers`

`VeyraRateLimitError.retryAfter` is parsed from `Retry-After` when the backend sends it.
