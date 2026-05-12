[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletionChunk

# Interface: TextCompletionChunk

Defined in: [src/types/completions.ts:47](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L47)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/completions.ts:48](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L48)

***

### object

> **object**: `"text_completion.chunk"`

Defined in: [src/types/completions.ts:49](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L49)

***

### created

> **created**: `number`

Defined in: [src/types/completions.ts:50](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L50)

***

### model

> **model**: `string`

Defined in: [src/types/completions.ts:51](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L51)

***

### choices

> **choices**: [`TextCompletionChoiceDelta`](TextCompletionChoiceDelta.md)[]

Defined in: [src/types/completions.ts:52](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L52)

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/completions.ts:53](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L53)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:23](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/shared.ts#L23)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
