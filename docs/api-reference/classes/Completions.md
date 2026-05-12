[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Completions

# Class: Completions

Defined in: [src/resources/completions.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/completions.ts#L13)

## Constructors

### Constructor

> **new Completions**(`_client`): `Completions`

Defined in: [src/resources/completions.ts:14](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/completions.ts#L14)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Completions`

## Methods

### create()

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`TextCompletion`](../interfaces/TextCompletion.md)\>

Defined in: [src/resources/completions.ts:16](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/completions.ts#L16)

##### Parameters

###### params

[`TextCompletionCreateParamsNonStreaming`](../interfaces/TextCompletionCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`TextCompletion`](../interfaces/TextCompletion.md)\>

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`TextCompletionChunk`](../interfaces/TextCompletionChunk.md)\>\>

Defined in: [src/resources/completions.ts:21](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/completions.ts#L21)

##### Parameters

###### params

[`TextCompletionCreateParamsStreaming`](../interfaces/TextCompletionCreateParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`TextCompletionChunk`](../interfaces/TextCompletionChunk.md)\>\>
