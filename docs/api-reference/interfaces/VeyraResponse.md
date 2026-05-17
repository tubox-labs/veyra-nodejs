[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / VeyraResponse

# Interface: VeyraResponse

Defined in: [src/types/responses.ts:78](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L78)

## Extends

- [`MetadataCarrier`](MetadataCarrier.md)

## Properties

### id

> **id**: `string`

Defined in: [src/types/responses.ts:79](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L79)

***

### object

> **object**: `"response"`

Defined in: [src/types/responses.ts:80](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L80)

***

### created?

> `optional` **created?**: `number`

Defined in: [src/types/responses.ts:81](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L81)

***

### createdAt?

> `optional` **createdAt?**: `number`

Defined in: [src/types/responses.ts:82](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L82)

***

### error?

> `optional` **error?**: `unknown`

Defined in: [src/types/responses.ts:83](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L83)

***

### incompleteDetails?

> `optional` **incompleteDetails?**: `unknown`

Defined in: [src/types/responses.ts:84](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L84)

***

### instructions?

> `optional` **instructions?**: `string` \| `null`

Defined in: [src/types/responses.ts:85](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L85)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Defined in: [src/types/responses.ts:86](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L86)

***

### model

> **model**: `string`

Defined in: [src/types/responses.ts:87](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L87)

***

### output

> **output**: [`ResponseOutputItem`](../type-aliases/ResponseOutputItem.md)[]

Defined in: [src/types/responses.ts:88](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L88)

***

### parallelToolCalls?

> `optional` **parallelToolCalls?**: `boolean`

Defined in: [src/types/responses.ts:89](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L89)

***

### temperature?

> `optional` **temperature?**: `number` \| `null`

Defined in: [src/types/responses.ts:90](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L90)

***

### toolChoice?

> `optional` **toolChoice?**: `string` \| `Record`\<`string`, `unknown`\> \| `null`

Defined in: [src/types/responses.ts:91](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L91)

***

### tools?

> `optional` **tools?**: `Record`\<`string`, `unknown`\>[]

Defined in: [src/types/responses.ts:92](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L92)

***

### topP?

> `optional` **topP?**: `number` \| `null`

Defined in: [src/types/responses.ts:93](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L93)

***

### maxOutputTokens?

> `optional` **maxOutputTokens?**: `number` \| `null`

Defined in: [src/types/responses.ts:94](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L94)

***

### usage

> **usage**: [`Usage`](Usage.md) \| `null`

Defined in: [src/types/responses.ts:95](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L95)

***

### status

> **status**: `string`

Defined in: [src/types/responses.ts:96](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L96)

***

### user?

> `optional` **user?**: `string` \| `null`

Defined in: [src/types/responses.ts:97](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L97)

***

### \_raw?

> `optional` **\_raw?**: `unknown`

Defined in: [src/types/shared.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/shared.ts#L38)

#### Inherited from

[`MetadataCarrier`](MetadataCarrier.md).[`_raw`](MetadataCarrier.md#_raw)
