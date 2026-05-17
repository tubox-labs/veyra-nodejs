[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletion

# Interface: ChatCompletion

Defined in: [src/types/chat.ts:70](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L70)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/chat.ts:71](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L71)

***

### object

> **object**: `"chat.completion"`

Defined in: [src/types/chat.ts:72](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L72)

***

### created

> **created**: `number`

Defined in: [src/types/chat.ts:73](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L73)

***

### model

> **model**: `string`

Defined in: [src/types/chat.ts:74](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L74)

***

### choices

> **choices**: [`Choice`](Choice.md)[]

Defined in: [src/types/chat.ts:75](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L75)

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/chat.ts:76](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L76)

***

### systemFingerprint

> **systemFingerprint**: `string` \| `null`

Defined in: [src/types/chat.ts:77](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L77)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
