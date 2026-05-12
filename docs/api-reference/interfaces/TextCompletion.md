[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / TextCompletion

# Interface: TextCompletion

Defined in: [src/types/completions.ts:32](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L32)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/completions.ts:33](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L33)

***

### object

> **object**: `"text_completion"`

Defined in: [src/types/completions.ts:34](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L34)

***

### created

> **created**: `number`

Defined in: [src/types/completions.ts:35](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L35)

***

### model

> **model**: `string`

Defined in: [src/types/completions.ts:36](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L36)

***

### choices

> **choices**: [`TextCompletionChoice`](TextCompletionChoice.md)[]

Defined in: [src/types/completions.ts:37](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L37)

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/completions.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/completions.ts#L38)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:23](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/shared.ts#L23)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
