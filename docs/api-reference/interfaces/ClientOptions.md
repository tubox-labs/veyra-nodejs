[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ClientOptions

# Interface: ClientOptions

Defined in: src/core/client.ts:22

## Properties

### apiKey?

> `optional` **apiKey?**: `string`

Defined in: src/core/client.ts:27

Veyra API key (`veyra_sk_...`).
Falls back to the `VEYRA_API_KEY` environment variable when omitted.

***

### baseURL?

> `optional` **baseURL?**: `string`

Defined in: src/core/client.ts:33

Override the default base URL `https://veyra.tubox.cloud`.
Falls back to `VEYRA_BASE_URL` environment variable.

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: src/core/client.ts:36

Request timeout in milliseconds (default `60_000`).

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: src/core/client.ts:39

Number of automatic retries on retryable errors (default `2`).

***

### defaultHeaders?

> `optional` **defaultHeaders?**: `Record`\<`string`, `string`\>

Defined in: src/core/client.ts:42

HTTP headers merged into every request.

***

### fetch?

> `optional` **fetch?**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: src/core/client.ts:45

Provide a custom `fetch` implementation.

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`URL` \| `RequestInfo`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`string` \| `URL` \| `Request`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>
