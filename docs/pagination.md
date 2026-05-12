# Pagination

List endpoints return `Page<T>`.

```ts
const page = await client.billing.usage.list({ limit: 50 });
for await (const item of page) {
  console.log(item.id);
}
```

Manual paging:

```ts
let current = await client.billing.usage.list({ limit: 50 });
while (current.hasMore) {
  current = (await current.nextPage())!;
}
```
