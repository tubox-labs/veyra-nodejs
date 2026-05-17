[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Veyra

# Class: Veyra

Defined in: [src/index.ts:169](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L169)

## Extends

- `VeyraClient`

## Constructors

### Constructor

> **new Veyra**(`options?`): `Veyra`

Defined in: [src/index.ts:195](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L195)

#### Parameters

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Veyra`

#### Overrides

`VeyraClient.constructor`

## Properties

### apiKey

> `readonly` **apiKey**: `string`

Defined in: [src/core/client.ts:55](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L55)

#### Inherited from

`VeyraClient.apiKey`

***

### baseURL

> `readonly` **baseURL**: `string`

Defined in: [src/core/client.ts:56](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L56)

#### Inherited from

`VeyraClient.baseURL`

***

### timeout

> `readonly` **timeout**: `number`

Defined in: [src/core/client.ts:57](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L57)

#### Inherited from

`VeyraClient.timeout`

***

### maxRetries

> `readonly` **maxRetries**: `number`

Defined in: [src/core/client.ts:58](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L58)

#### Inherited from

`VeyraClient.maxRetries`

***

### \_defaultHeaders

> `protected` `readonly` **\_defaultHeaders**: `Record`\<`string`, `string`\>

Defined in: [src/core/client.ts:60](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L60)

#### Inherited from

`VeyraClient._defaultHeaders`

***

### \_fetch

> `protected` `readonly` **\_fetch**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [src/core/client.ts:61](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L61)

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

#### Inherited from

`VeyraClient._fetch`

***

### \_rawResponseMode

> `protected` `readonly` **\_rawResponseMode**: `boolean`

Defined in: [src/core/client.ts:62](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L62)

#### Inherited from

`VeyraClient._rawResponseMode`

***

### chat

> `readonly` **chat**: [`Chat`](Chat.md)

Defined in: [src/index.ts:171](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L171)

Chat completion endpoints: `client.chat.completions.create(...)`

***

### completions

> `readonly` **completions**: [`Completions`](Completions.md)

Defined in: [src/index.ts:173](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L173)

Legacy text completion endpoint: `client.completions.create(...)`

***

### responses

> `readonly` **responses**: [`Responses`](Responses.md)

Defined in: [src/index.ts:175](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L175)

OpenAI Responses API wrapper: `client.responses.create(...)`

***

### embeddings

> `readonly` **embeddings**: [`Embeddings`](Embeddings.md)

Defined in: [src/index.ts:177](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L177)

Embedding generation: `client.embeddings.create(...)`

***

### images

> `readonly` **images**: [`Images`](Images.md)

Defined in: [src/index.ts:179](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L179)

Image generation: `client.images.generations.create(...)`

***

### audio

> `readonly` **audio**: [`Audio`](Audio.md)

Defined in: [src/index.ts:181](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L181)

Audio transcription: `client.audio.transcriptions.create(...)`

***

### models

> `readonly` **models**: [`Models`](Models.md)

Defined in: [src/index.ts:183](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L183)

Model listing and retrieval: `client.models.list()` / `.retrieve(id)`

***

### quota

> `readonly` **quota**: [`Quota`](Quota.md)

Defined in: [src/index.ts:185](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L185)

Quota status and plans: `client.quota.status()`

***

### billing

> `readonly` **billing**: [`Billing`](Billing.md)

Defined in: [src/index.ts:187](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L187)

Billing usage, profile, and access: `client.billing.usage.list()`

***

### apiKeys

> `readonly` **apiKeys**: [`APIKeys`](APIKeys.md)

Defined in: [src/index.ts:189](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L189)

API key management: `client.apiKeys.create(...)`

***

### assistant

> `readonly` **assistant**: [`Assistant`](Assistant.md)

Defined in: [src/index.ts:191](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L191)

In-app assistant: `client.assistant.chat(...)`

***

### health

> `readonly` **health**: [`Health`](Health.md)

Defined in: [src/index.ts:193](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L193)

Platform health checks: `client.health.check()`

## Accessors

### withRawResponse

#### Get Signature

> **get** **withRawResponse**(): [`VeyraWithRawResponse`](../interfaces/VeyraWithRawResponse.md)

Defined in: [src/index.ts:214](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L214)

Returns a new client variant that resolves to `APIResponse<T>` wrappers.

##### Returns

[`VeyraWithRawResponse`](../interfaces/VeyraWithRawResponse.md)

## Methods

### \_cloneClientOptions()

> `protected` **\_cloneClientOptions**(`rawResponseMode`): `InternalClientOptions`

Defined in: [src/core/client.ts:89](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L89)

#### Parameters

##### rawResponseMode

`boolean`

#### Returns

`InternalClientOptions`

#### Inherited from

`VeyraClient._cloneClientOptions`

***

### \_buildHeaders()

> `protected` **\_buildHeaders**(`extra?`, `hasBody?`, `isMultipart?`): `Record`\<`string`, `string`\>

Defined in: [src/core/client.ts:102](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L102)

Build the merged headers for a single request.

#### Parameters

##### extra?

`Record`\<`string`, `string`\>

##### hasBody?

`boolean`

##### isMultipart?

`boolean`

#### Returns

`Record`\<`string`, `string`\>

#### Inherited from

`VeyraClient._buildHeaders`

***

### \_request()

> `protected` **\_request**\<`T`\>(`method`, `path`, `body?`, `params?`, `opts?`): `Promise`\<`T` \| [`APIResponse`](../interfaces/APIResponse.md)\<`T`\>\>

Defined in: [src/core/client.ts:119](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L119)

Core request dispatcher. Handles serialisation, timeout, retry, and error mapping.

#### Type Parameters

##### T

`T`

#### Parameters

##### method

`HTTPMethod`

##### path

`string`

##### body?

`unknown`

##### params?

`Record`\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

##### opts?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`T` \| [`APIResponse`](../interfaces/APIResponse.md)\<`T`\>\>

#### Inherited from

`VeyraClient._request`

***

### \_requestRaw()

> `protected` **\_requestRaw**(`method`, `path`, `body?`, `params?`, `opts?`): `Promise`\<`Response`\>

Defined in: [src/core/client.ts:151](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L151)

Variant that returns the raw Response.

#### Parameters

##### method

`HTTPMethod`

##### path

`string`

##### body?

`unknown`

##### params?

`Record`\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

##### opts?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`Response`\>

#### Inherited from

`VeyraClient._requestRaw`

***

### \_shouldRetry()

> `protected` **\_shouldRetry**(`response`, `attempt`, `maxRetries`): `boolean`

Defined in: [src/core/client.ts:217](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L217)

Whether this status code + body should be retried.

#### Parameters

##### response

`Response` \| `null`

##### attempt

`number`

##### maxRetries

`number`

#### Returns

`boolean`

#### Inherited from

`VeyraClient._shouldRetry`

***

### \_retryDelay()

> `protected` **\_retryDelay**(`response`, `attempt`): `number`

Defined in: [src/core/client.ts:224](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/client.ts#L224)

Milliseconds to wait before the next attempt.

#### Parameters

##### response

`Response` \| `null`

##### attempt

`number`

#### Returns

`number`

#### Inherited from

`VeyraClient._retryDelay`
