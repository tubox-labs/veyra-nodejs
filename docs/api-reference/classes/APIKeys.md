[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / APIKeys

# Class: APIKeys

Defined in: src/resources/apiKeys.ts:10

## Constructors

### Constructor

> **new APIKeys**(`_client`): `APIKeys`

Defined in: src/resources/apiKeys.ts:11

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`APIKeys`

## Methods

### create()

> **create**(`params`, `options?`): `Promise`\<[`CreateAPIKeyResponse`](../interfaces/CreateAPIKeyResponse.md)\>

Defined in: src/resources/apiKeys.ts:16

#### Parameters

##### params

[`CreateAPIKeyParams`](../interfaces/CreateAPIKeyParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`CreateAPIKeyResponse`](../interfaces/CreateAPIKeyResponse.md)\>

***

### list()

> **list**(`options?`): `Promise`\<[`APIKey`](../interfaces/APIKey.md)[]\>

Defined in: src/resources/apiKeys.ts:32

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`APIKey`](../interfaces/APIKey.md)[]\>

***

### update()

> **update**(`keyId`, `params`, `options?`): `Promise`\<[`APIKey`](../interfaces/APIKey.md)\>

Defined in: src/resources/apiKeys.ts:45

#### Parameters

##### keyId

`string`

##### params

[`UpdateAPIKeyParams`](../interfaces/UpdateAPIKeyParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`APIKey`](../interfaces/APIKey.md)\>

***

### revoke()

> **revoke**(`keyId`, `options?`): `Promise`\<`void`\>

Defined in: src/resources/apiKeys.ts:62

#### Parameters

##### keyId

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`void`\>
