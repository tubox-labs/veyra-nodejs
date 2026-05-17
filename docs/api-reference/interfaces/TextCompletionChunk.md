[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletionChunk

# Interface: TextCompletionChunk

Defined in: [src/types/completions.ts:53](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L53)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/completions.ts:54](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L54)

***

### object

> **object**: `"text_completion.chunk"`

Defined in: [src/types/completions.ts:55](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L55)

***

### created

> **created**: `number`

Defined in: [src/types/completions.ts:56](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L56)

***

### model

> **model**: `string`

Defined in: [src/types/completions.ts:57](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L57)

***

### choices

> **choices**: [`TextCompletionChoiceDelta`](TextCompletionChoiceDelta.md)[]

Defined in: [src/types/completions.ts:58](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L58)

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/completions.ts:59](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L59)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
