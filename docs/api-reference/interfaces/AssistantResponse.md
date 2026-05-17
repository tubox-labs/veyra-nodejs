[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / AssistantResponse

# Interface: AssistantResponse

Defined in: [src/types/assistant.ts:27](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L27)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### answer

> **answer**: `string`

Defined in: [src/types/assistant.ts:28](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L28)

***

### model

> **model**: `string`

Defined in: [src/types/assistant.ts:29](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L29)

***

### references

> **references**: `string`[]

Defined in: [src/types/assistant.ts:30](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L30)

***

### blocked

> **blocked**: `boolean`

Defined in: [src/types/assistant.ts:31](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L31)

***

### requiresLogin

> **requiresLogin**: `boolean`

Defined in: [src/types/assistant.ts:32](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L32)

***

### scopeLimited

> **scopeLimited**: `boolean`

Defined in: [src/types/assistant.ts:33](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L33)

***

### id?

> `optional` **id?**: `string`

Defined in: [src/types/assistant.ts:34](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L34)

***

### conversationId?

> `optional` **conversationId?**: `string`

Defined in: [src/types/assistant.ts:35](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L35)

***

### message?

> `optional` **message?**: `string`

Defined in: [src/types/assistant.ts:36](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L36)

***

### usage?

> `optional` **usage?**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/assistant.ts:37](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L37)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
