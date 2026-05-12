# Error Handling

All SDK errors extend `VeyraError`.

- API errors: `VeyraAPIError` and subclasses.
- Connection errors: `VeyraAPIConnectionError`, `VeyraAPITimeoutError`.

```ts
try {
  await client.chat.completions.create({ ... });
} catch (error) {
  if (error instanceof VeyraRateLimitError) {
    console.error(error.retryAfter);
  }
}
```
