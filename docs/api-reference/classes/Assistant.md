[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Assistant

# Class: Assistant

Defined in: [src/resources/assistant.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/assistant.ts#L13)

## Constructors

### Constructor

> **new Assistant**(`_client`): `Assistant`

Defined in: [src/resources/assistant.ts:14](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/assistant.ts#L14)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Assistant`

## Methods

### chat()

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

Defined in: [src/resources/assistant.ts:16](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/assistant.ts#L16)

##### Parameters

###### params

[`AssistantChatParamsNonStreaming`](../interfaces/AssistantChatParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>

Defined in: [src/resources/assistant.ts:21](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/resources/assistant.ts#L21)

##### Parameters

###### params

[`AssistantChatParamsStreaming`](../interfaces/AssistantChatParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>
