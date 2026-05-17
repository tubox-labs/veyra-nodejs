[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ChatCompletionChunk

# Interface: ChatCompletionChunk

Defined in: [src/types/chat.ts:92](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L92)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/chat.ts:93](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L93)

***

### object

> **object**: `"chat.completion.chunk"`

Defined in: [src/types/chat.ts:94](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L94)

***

### created

> **created**: `number`

Defined in: [src/types/chat.ts:95](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L95)

***

### model

> **model**: `string`

Defined in: [src/types/chat.ts:96](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L96)

***

### choices

> **choices**: [`StreamChoice`](StreamChoice.md)[]

Defined in: [src/types/chat.ts:97](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L97)

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/chat.ts:98](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L98)

***

### systemFingerprint?

> `optional` **systemFingerprint?**: `string` \| `null`

Defined in: [src/types/chat.ts:99](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/chat.ts#L99)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
