[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Stream

# Class: Stream\<T\>

Defined in: [src/core/streaming.ts:6](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/streaming.ts#L6)

An async iterable of SSE-parsed, strongly-typed objects.

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new Stream**\<`T`\>(`response`, `deserialise`): `Stream`\<`T`\>

Defined in: [src/core/streaming.ts:11](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/streaming.ts#L11)

#### Parameters

##### response

`Response`

##### deserialise

(`raw`) => `T`

#### Returns

`Stream`\<`T`\>

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<`T`\>

Defined in: [src/core/streaming.ts:19](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/streaming.ts#L19)

Iterate over SSE events.

#### Returns

`AsyncIterator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### toReadableStream()

> **toReadableStream**(): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [src/core/streaming.ts:94](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/streaming.ts#L94)

Convert the stream to a browser/edge-compatible ReadableStream.

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>
