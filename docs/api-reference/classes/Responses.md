[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Responses

# Class: Responses

Defined in: [src/resources/responses.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/responses.ts#L13)

## Constructors

### Constructor

> **new Responses**(`_client`): `Responses`

Defined in: [src/resources/responses.ts:14](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/responses.ts#L14)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Responses`

## Methods

### create()

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

Defined in: [src/resources/responses.ts:16](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/responses.ts#L16)

##### Parameters

###### params

[`ResponseCreateParamsNonStreaming`](../interfaces/ResponseCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>

Defined in: [src/resources/responses.ts:21](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/responses.ts#L21)

##### Parameters

###### params

[`ResponseCreateParamsStreaming`](../interfaces/ResponseCreateParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>
