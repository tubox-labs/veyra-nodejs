[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Assistant

# Class: Assistant

Defined in: src/resources/assistant.ts:12

## Constructors

### Constructor

> **new Assistant**(`_client`): `Assistant`

Defined in: src/resources/assistant.ts:13

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Assistant`

## Methods

### chat()

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

Defined in: src/resources/assistant.ts:15

##### Parameters

###### params

[`AssistantChatParamsNonStreaming`](../interfaces/AssistantChatParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>

Defined in: src/resources/assistant.ts:20

##### Parameters

###### params

[`AssistantChatParamsStreaming`](../interfaces/AssistantChatParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>
