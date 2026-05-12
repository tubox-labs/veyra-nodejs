[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Stream

# Class: Stream\<T\>

Defined in: src/core/streaming.ts:6

An async iterable of SSE-parsed, strongly-typed objects.

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new Stream**\<`T`\>(`response`, `deserialise`): `Stream`\<`T`\>

Defined in: src/core/streaming.ts:11

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

Defined in: src/core/streaming.ts:19

Iterate over SSE events.

#### Returns

`AsyncIterator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### toReadableStream()

> **toReadableStream**(): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: src/core/streaming.ts:94

Convert the stream to a browser/edge-compatible ReadableStream.

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>
