[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletion

# Interface: ChatCompletion

Defined in: src/types/chat.ts:54

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: src/types/chat.ts:55

***

### object

> **object**: `"chat.completion"`

Defined in: src/types/chat.ts:56

***

### created

> **created**: `number`

Defined in: src/types/chat.ts:57

***

### model

> **model**: `string`

Defined in: src/types/chat.ts:58

***

### choices

> **choices**: [`Choice`](Choice.md)[]

Defined in: src/types/chat.ts:59

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: src/types/chat.ts:60

***

### systemFingerprint

> **systemFingerprint**: `string` \| `null`

Defined in: src/types/chat.ts:61

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: src/types/shared.ts:23

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
