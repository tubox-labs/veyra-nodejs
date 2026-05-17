# Pagination

Paginated list endpoints return `Page<T>`. Today this is used by `client.billing.usage.list()`.

```ts
const page = await client.billing.usage.list({ limit: 50 });
for await (const item of page) {
  console.log(item.createdAt, item.model, item.totalTokens);
}
```

Manual paging:

```ts
let current = await client.billing.usage.list({ limit: 50 });
while (current.hasMore) {
  current = (await current.nextPage())!;
}
```

Page objects expose:

- `items`
- `total`
- `offset`
- `limit`
- `hasMore`
- `nextOffset`
- `nextPage()`
- `iterPages()`

`nextOffset` is computed as `offset + items.length`. This matches the backend's offset pagination contract and avoids skipping records if the backend returns fewer rows than the requested limit.

```ts
const first = await client.billing.usage.list({
  since: "2026-05-01T00:00:00Z",
  until: "2026-05-17T00:00:00Z",
  limit: 100,
});

for await (const page of first.iterPages()) {
  console.log(`page offset=${page.offset} count=${page.items.length}`);
}
```
