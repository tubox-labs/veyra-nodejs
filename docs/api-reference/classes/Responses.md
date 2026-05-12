[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Responses

# Class: Responses

Defined in: src/resources/responses.ts:12

## Constructors

### Constructor

> **new Responses**(`_client`): `Responses`

Defined in: src/resources/responses.ts:13

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Responses`

## Methods

### create()

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

Defined in: src/resources/responses.ts:15

##### Parameters

###### params

[`ResponseCreateParamsNonStreaming`](../interfaces/ResponseCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>

Defined in: src/resources/responses.ts:20

##### Parameters

###### params

[`ResponseCreateParamsStreaming`](../interfaces/ResponseCreateParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>
