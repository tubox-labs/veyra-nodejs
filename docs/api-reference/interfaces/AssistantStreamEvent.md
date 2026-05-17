[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / AssistantStreamEvent

# Interface: AssistantStreamEvent

Defined in: [src/types/assistant.ts:40](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L40)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### type

> **type**: `string`

Defined in: [src/types/assistant.ts:41](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L41)

***

### delta?

> `optional` **delta?**: `string`

Defined in: [src/types/assistant.ts:42](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L42)

***

### done?

> `optional` **done?**: `boolean`

Defined in: [src/types/assistant.ts:43](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L43)

***

### conversationId?

> `optional` **conversationId?**: `string`

Defined in: [src/types/assistant.ts:44](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L44)

***

### answer?

> `optional` **answer?**: `string`

Defined in: [src/types/assistant.ts:45](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L45)

***

### model?

> `optional` **model?**: `string`

Defined in: [src/types/assistant.ts:46](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L46)

***

### references?

> `optional` **references?**: `string`[]

Defined in: [src/types/assistant.ts:47](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L47)

***

### blocked?

> `optional` **blocked?**: `boolean`

Defined in: [src/types/assistant.ts:48](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L48)

***

### requiresLogin?

> `optional` **requiresLogin?**: `boolean`

Defined in: [src/types/assistant.ts:49](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L49)

***

### scopeLimited?

> `optional` **scopeLimited?**: `boolean`

Defined in: [src/types/assistant.ts:50](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/assistant.ts#L50)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
