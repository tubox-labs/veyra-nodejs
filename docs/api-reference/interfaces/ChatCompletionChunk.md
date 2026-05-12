[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletionChunk

# Interface: ChatCompletionChunk

Defined in: src/types/chat.ts:75

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: src/types/chat.ts:76

***

### object

> **object**: `"chat.completion.chunk"`

Defined in: src/types/chat.ts:77

***

### created

> **created**: `number`

Defined in: src/types/chat.ts:78

***

### model

> **model**: `string`

Defined in: src/types/chat.ts:79

***

### choices

> **choices**: [`StreamChoice`](StreamChoice.md)[]

Defined in: src/types/chat.ts:80

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: src/types/chat.ts:81

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: src/types/shared.ts:23

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
