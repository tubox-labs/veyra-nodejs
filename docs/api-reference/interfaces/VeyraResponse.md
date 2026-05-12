[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / VeyraResponse

# Interface: VeyraResponse

Defined in: src/types/responses.ts:37

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: src/types/responses.ts:38

***

### object

> **object**: `"response"`

Defined in: src/types/responses.ts:39

***

### created

> **created**: `number`

Defined in: src/types/responses.ts:40

***

### model

> **model**: `string`

Defined in: src/types/responses.ts:41

***

### output

> **output**: [`ResponseOutputMessage`](ResponseOutputMessage.md)[]

Defined in: src/types/responses.ts:42

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: src/types/responses.ts:43

***

### status

> **status**: `string`

Defined in: src/types/responses.ts:44

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: src/types/shared.ts:23

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
