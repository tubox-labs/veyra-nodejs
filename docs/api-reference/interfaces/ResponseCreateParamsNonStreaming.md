[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / ResponseCreateParamsNonStreaming

# Interface: ResponseCreateParamsNonStreaming

Defined in: [src/types/responses.ts:37](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L37)

## Extends

- `ResponseCreateParamsBase`

## Properties

### model

> **model**: `string`

Defined in: [src/types/responses.ts:23](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L23)

#### Inherited from

`ResponseCreateParamsBase.model`

***

### input

> **input**: [`ResponseInput`](../type-aliases/ResponseInput.md)

Defined in: [src/types/responses.ts:24](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L24)

#### Inherited from

`ResponseCreateParamsBase.input`

***

### instructions?

> `optional` **instructions?**: `string`

Defined in: [src/types/responses.ts:25](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L25)

#### Inherited from

`ResponseCreateParamsBase.instructions`

***

### temperature?

> `optional` **temperature?**: `number`

Defined in: [src/types/responses.ts:26](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L26)

#### Inherited from

`ResponseCreateParamsBase.temperature`

***

### topP?

> `optional` **topP?**: `number`

Defined in: [src/types/responses.ts:27](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L27)

#### Inherited from

`ResponseCreateParamsBase.topP`

***

### maxOutputTokens?

> `optional` **maxOutputTokens?**: `number`

Defined in: [src/types/responses.ts:28](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L28)

#### Inherited from

`ResponseCreateParamsBase.maxOutputTokens`

***

### responseFormat?

> `optional` **responseFormat?**: [`ResponseFormat`](../type-aliases/ResponseFormat.md)

Defined in: [src/types/responses.ts:29](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L29)

#### Inherited from

`ResponseCreateParamsBase.responseFormat`

***

### reasoning?

> `optional` **reasoning?**: [`ReasoningConfig`](ReasoningConfig.md)

Defined in: [src/types/responses.ts:30](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L30)

#### Inherited from

`ResponseCreateParamsBase.reasoning`

***

### parallelToolCalls?

> `optional` **parallelToolCalls?**: `boolean`

Defined in: [src/types/responses.ts:31](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L31)

#### Inherited from

`ResponseCreateParamsBase.parallelToolCalls`

***

### truncation?

> `optional` **truncation?**: `"auto"` \| `string` & `Record`\<`never`, `never`\> \| `"disabled"`

Defined in: [src/types/responses.ts:32](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L32)

#### Inherited from

`ResponseCreateParamsBase.truncation`

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string` \| `number` \| `boolean` \| `null`\>

Defined in: [src/types/responses.ts:33](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L33)

#### Inherited from

`ResponseCreateParamsBase.metadata`

***

### user?

> `optional` **user?**: `string`

Defined in: [src/types/responses.ts:34](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L34)

#### Inherited from

`ResponseCreateParamsBase.user`

***

### stream?

> `optional` **stream?**: `false`

Defined in: [src/types/responses.ts:38](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/types/responses.ts#L38)
