[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletion

# Interface: ChatCompletion

Defined in: [src/types/chat.ts:54](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L54)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/chat.ts:55](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L55)

***

### object

> **object**: `"chat.completion"`

Defined in: [src/types/chat.ts:56](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L56)

***

### created

> **created**: `number`

Defined in: [src/types/chat.ts:57](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L57)

***

### model

> **model**: `string`

Defined in: [src/types/chat.ts:58](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L58)

***

### choices

> **choices**: [`Choice`](Choice.md)[]

Defined in: [src/types/chat.ts:59](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L59)

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/chat.ts:60](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L60)

***

### systemFingerprint

> **systemFingerprint**: `string` \| `null`

Defined in: [src/types/chat.ts:61](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/chat.ts#L61)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:23](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/types/shared.ts#L23)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
