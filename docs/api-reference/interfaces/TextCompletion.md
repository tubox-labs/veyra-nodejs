[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletion

# Interface: TextCompletion

Defined in: [src/types/completions.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L38)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/completions.ts:39](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L39)

***

### object

> **object**: `"text_completion"`

Defined in: [src/types/completions.ts:40](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L40)

***

### created

> **created**: `number`

Defined in: [src/types/completions.ts:41](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L41)

***

### model

> **model**: `string`

Defined in: [src/types/completions.ts:42](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L42)

***

### choices

> **choices**: [`TextCompletionChoice`](TextCompletionChoice.md)[]

Defined in: [src/types/completions.ts:43](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L43)

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/completions.ts:44](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/completions.ts#L44)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
