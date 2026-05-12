[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletion

# Interface: TextCompletion

Defined in: src/types/completions.ts:32

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: src/types/completions.ts:33

***

### object

> **object**: `"text_completion"`

Defined in: src/types/completions.ts:34

***

### created

> **created**: `number`

Defined in: src/types/completions.ts:35

***

### model

> **model**: `string`

Defined in: src/types/completions.ts:36

***

### choices

> **choices**: [`TextCompletionChoice`](TextCompletionChoice.md)[]

Defined in: src/types/completions.ts:37

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: src/types/completions.ts:38

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: src/types/shared.ts:23

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
