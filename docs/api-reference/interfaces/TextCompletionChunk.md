[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletionChunk

# Interface: TextCompletionChunk

Defined in: src/types/completions.ts:47

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: src/types/completions.ts:48

***

### object

> **object**: `"text_completion.chunk"`

Defined in: src/types/completions.ts:49

***

### created

> **created**: `number`

Defined in: src/types/completions.ts:50

***

### model

> **model**: `string`

Defined in: src/types/completions.ts:51

***

### choices

> **choices**: [`TextCompletionChoiceDelta`](TextCompletionChoiceDelta.md)[]

Defined in: src/types/completions.ts:52

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: src/types/completions.ts:53

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: src/types/shared.ts:23

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
