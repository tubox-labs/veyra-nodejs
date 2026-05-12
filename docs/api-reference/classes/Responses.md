[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Responses

# Class: Responses

Defined in: [src/resources/responses.ts:12](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/responses.ts#L12)

## Constructors

### Constructor

> **new Responses**(`_client`): `Responses`

Defined in: [src/resources/responses.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/responses.ts#L13)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Responses`

## Methods

### create()

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

Defined in: [src/resources/responses.ts:15](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/responses.ts#L15)

##### Parameters

###### params

[`ResponseCreateParamsNonStreaming`](../interfaces/ResponseCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`VeyraResponse`](../interfaces/VeyraResponse.md)\>

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>

Defined in: [src/resources/responses.ts:20](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/responses.ts#L20)

##### Parameters

###### params

[`ResponseCreateParamsStreaming`](../interfaces/ResponseCreateParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`ResponseStreamEvent`](../interfaces/ResponseStreamEvent.md)\>\>
