[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Completions

# Class: Completions

Defined in: [src/resources/completions.ts:14](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/completions.ts#L14)

## Constructors

### Constructor

> **new Completions**(`_client`): `Completions`

Defined in: [src/resources/completions.ts:15](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/completions.ts#L15)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Completions`

## Methods

### create()

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`TextCompletion`](../interfaces/TextCompletion.md)\>

Defined in: [src/resources/completions.ts:17](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/completions.ts#L17)

##### Parameters

###### params

[`TextCompletionCreateParamsNonStreaming`](../interfaces/TextCompletionCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`TextCompletion`](../interfaces/TextCompletion.md)\>

#### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`TextCompletionChunk`](../interfaces/TextCompletionChunk.md)\>\>

Defined in: [src/resources/completions.ts:22](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/completions.ts#L22)

##### Parameters

###### params

[`TextCompletionCreateParamsStreaming`](../interfaces/TextCompletionCreateParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`TextCompletionChunk`](../interfaces/TextCompletionChunk.md)\>\>
