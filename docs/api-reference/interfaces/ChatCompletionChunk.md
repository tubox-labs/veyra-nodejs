[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletionChunk

# Interface: ChatCompletionChunk

Defined in: [src/types/chat.ts:75](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L75)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/chat.ts:76](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L76)

***

### object

> **object**: `"chat.completion.chunk"`

Defined in: [src/types/chat.ts:77](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L77)

***

### created

> **created**: `number`

Defined in: [src/types/chat.ts:78](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L78)

***

### model

> **model**: `string`

Defined in: [src/types/chat.ts:79](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L79)

***

### choices

> **choices**: [`StreamChoice`](StreamChoice.md)[]

Defined in: [src/types/chat.ts:80](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L80)

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/chat.ts:81](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L81)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:23](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/shared.ts#L23)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
