[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ResponseStreamEvent

# Interface: ResponseStreamEvent

Defined in: [src/types/responses.ts:100](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L100)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### type

> **type**: `string`

Defined in: [src/types/responses.ts:101](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L101)

***

### responseId?

> `optional` **responseId?**: `string`

Defined in: [src/types/responses.ts:102](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L102)

***

### response?

> `optional` **response?**: [`VeyraResponse`](VeyraResponse.md)

Defined in: [src/types/responses.ts:103](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L103)

***

### itemId?

> `optional` **itemId?**: `string`

Defined in: [src/types/responses.ts:104](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L104)

***

### item?

> `optional` **item?**: [`ResponseOutputItem`](../type-aliases/ResponseOutputItem.md)

Defined in: [src/types/responses.ts:105](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L105)

***

### outputIndex?

> `optional` **outputIndex?**: `number`

Defined in: [src/types/responses.ts:106](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L106)

***

### contentIndex?

> `optional` **contentIndex?**: `number`

Defined in: [src/types/responses.ts:107](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L107)

***

### delta?

> `optional` **delta?**: `string`

Defined in: [src/types/responses.ts:108](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L108)

***

### text?

> `optional` **text?**: `string`

Defined in: [src/types/responses.ts:109](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L109)

***

### done?

> `optional` **done?**: `boolean`

Defined in: [src/types/responses.ts:110](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L110)

***

### sequenceNumber?

> `optional` **sequenceNumber?**: `number`

Defined in: [src/types/responses.ts:111](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L111)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
