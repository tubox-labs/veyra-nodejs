[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Assistant

# Class: Assistant

Defined in: [src/resources/assistant.ts:12](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/assistant.ts#L12)

## Constructors

### Constructor

> **new Assistant**(`_client`): `Assistant`

Defined in: [src/resources/assistant.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/assistant.ts#L13)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Assistant`

## Methods

### chat()

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

Defined in: [src/resources/assistant.ts:15](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/assistant.ts#L15)

##### Parameters

###### params

[`AssistantChatParamsNonStreaming`](../interfaces/AssistantChatParamsNonStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`AssistantResponse`](../interfaces/AssistantResponse.md)\>

#### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>

Defined in: [src/resources/assistant.ts:20](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/assistant.ts#L20)

##### Parameters

###### params

[`AssistantChatParamsStreaming`](../interfaces/AssistantChatParamsStreaming.md)

###### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

##### Returns

`Promise`\<[`Stream`](Stream.md)\<[`AssistantStreamEvent`](../interfaces/AssistantStreamEvent.md)\>\>
