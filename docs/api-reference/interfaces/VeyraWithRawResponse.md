[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / VeyraWithRawResponse

# Interface: VeyraWithRawResponse

Defined in: [src/index.ts:58](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L58)

## Properties

### chat

> `readonly` **chat**: `object`

Defined in: [src/index.ts:59](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L59)

#### completions

> `readonly` **completions**: `object`

##### completions.create()

###### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`ChatCompletion`](ChatCompletion.md)\>\>

###### Parameters

###### params

[`ChatCompletionCreateParamsNonStreaming`](ChatCompletionCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`ChatCompletion`](ChatCompletion.md)\>\>

###### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](../classes/Stream.md)\<[`ChatCompletionChunk`](ChatCompletionChunk.md)\>\>

###### Parameters

###### params

[`ChatCompletionCreateParamsStreaming`](ChatCompletionCreateParamsStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`Stream`](../classes/Stream.md)\<[`ChatCompletionChunk`](ChatCompletionChunk.md)\>\>

***

### completions

> `readonly` **completions**: `object`

Defined in: [src/index.ts:71](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L71)

#### create()

##### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`TextCompletion`](TextCompletion.md)\>\>

###### Parameters

###### params

[`TextCompletionCreateParamsNonStreaming`](TextCompletionCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`TextCompletion`](TextCompletion.md)\>\>

##### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](../classes/Stream.md)\<[`TextCompletionChunk`](TextCompletionChunk.md)\>\>

###### Parameters

###### params

[`TextCompletionCreateParamsStreaming`](TextCompletionCreateParamsStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`Stream`](../classes/Stream.md)\<[`TextCompletionChunk`](TextCompletionChunk.md)\>\>

***

### responses

> `readonly` **responses**: `object`

Defined in: [src/index.ts:81](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L81)

#### create()

##### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`VeyraResponse`](VeyraResponse.md)\>\>

###### Parameters

###### params

[`ResponseCreateParamsNonStreaming`](ResponseCreateParamsNonStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`VeyraResponse`](VeyraResponse.md)\>\>

##### Call Signature

> **create**(`params`, `options?`): `Promise`\<[`Stream`](../classes/Stream.md)\<[`ResponseStreamEvent`](ResponseStreamEvent.md)\>\>

###### Parameters

###### params

[`ResponseCreateParamsStreaming`](ResponseCreateParamsStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`Stream`](../classes/Stream.md)\<[`ResponseStreamEvent`](ResponseStreamEvent.md)\>\>

***

### embeddings

> `readonly` **embeddings**: `object`

Defined in: [src/index.ts:91](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L91)

#### create()

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`EmbeddingResponse`](EmbeddingResponse.md)\>\>

##### Parameters

###### params

[`EmbeddingCreateParams`](EmbeddingCreateParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`EmbeddingResponse`](EmbeddingResponse.md)\>\>

***

### images

> `readonly` **images**: `object`

Defined in: [src/index.ts:97](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L97)

#### generations

> `readonly` **generations**: `object`

##### generations.create()

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`ImageGenerationResponse`](ImageGenerationResponse.md)\>\>

###### Parameters

###### params

[`ImageGenerationCreateParams`](ImageGenerationCreateParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`ImageGenerationResponse`](ImageGenerationResponse.md)\>\>

***

### audio

> `readonly` **audio**: `object`

Defined in: [src/index.ts:105](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L105)

#### transcriptions

> `readonly` **transcriptions**: `object`

##### transcriptions.create()

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`AudioTranscription`](AudioTranscription.md)\>\>

###### Parameters

###### params

[`AudioTranscriptionCreateParams`](AudioTranscriptionCreateParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`AudioTranscription`](AudioTranscription.md)\>\>

***

### models

> `readonly` **models**: `object`

Defined in: [src/index.ts:113](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L113)

#### list()

> **list**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`ModelList`](ModelList.md)\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`ModelList`](ModelList.md)\>\>

#### retrieve()

> **retrieve**(`modelId`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`ModelInfo`](ModelInfo.md)\>\>

##### Parameters

###### modelId

`string`

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`ModelInfo`](ModelInfo.md)\>\>

***

### quota

> `readonly` **quota**: `object`

Defined in: [src/index.ts:117](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L117)

#### status()

> **status**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaStatus`](QuotaStatus.md)\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaStatus`](QuotaStatus.md)\>\>

#### listPlans()

> **listPlans**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaPlan`](QuotaPlan.md)[]\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaPlan`](QuotaPlan.md)[]\>\>

#### listPublicPlans()

> **listPublicPlans**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaPlan`](QuotaPlan.md)[]\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`QuotaPlan`](QuotaPlan.md)[]\>\>

***

### billing

> `readonly` **billing**: `object`

Defined in: [src/index.ts:122](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L122)

#### usage

> `readonly` **usage**: `object`

##### usage.list()

> **list**(`params?`, `options?`): `Promise`\<[`Page`](../classes/Page.md)\<[`UsageRecord`](UsageRecord.md)\>\>

###### Parameters

###### params?

[`BillingUsageListParams`](BillingUsageListParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`Page`](../classes/Page.md)\<[`UsageRecord`](UsageRecord.md)\>\>

##### usage.dailySummary()

> **dailySummary**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`UsageSummary`](UsageSummary.md)\>\>

###### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`UsageSummary`](UsageSummary.md)\>\>

##### usage.monthlySummary()

> **monthlySummary**(`params?`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`UsageSummary`](UsageSummary.md)\>\>

###### Parameters

###### params?

###### year?

`number`

###### month?

`number`

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`UsageSummary`](UsageSummary.md)\>\>

#### profile

> `readonly` **profile**: `object`

##### profile.retrieve()

> **retrieve**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingProfile`](BillingProfile.md) \| `null`\>\>

###### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingProfile`](BillingProfile.md) \| `null`\>\>

##### profile.upsert()

> **upsert**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingProfile`](BillingProfile.md)\>\>

###### Parameters

###### params

[`BillingProfileUpsertParams`](../type-aliases/BillingProfileUpsertParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingProfile`](BillingProfile.md)\>\>

##### profile.access()

> **access**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingAccess`](BillingAccess.md)\>\>

###### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`BillingAccess`](BillingAccess.md)\>\>

***

### apiKeys

> `readonly` **apiKeys**: `object`

Defined in: [src/index.ts:140](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L140)

#### create()

> **create**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`CreateAPIKeyResponse`](CreateAPIKeyResponse.md)\>\>

##### Parameters

###### params

[`CreateAPIKeyParams`](CreateAPIKeyParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`CreateAPIKeyResponse`](CreateAPIKeyResponse.md)\>\>

#### list()

> **list**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`APIKey`](APIKey.md)[]\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`APIKey`](APIKey.md)[]\>\>

#### update()

> **update**(`keyId`, `params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`APIKey`](APIKey.md)\>\>

##### Parameters

###### keyId

`string`

###### params

[`UpdateAPIKeyParams`](UpdateAPIKeyParams.md)

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`APIKey`](APIKey.md)\>\>

#### revoke()

> **revoke**(`keyId`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<`void`\>\>

##### Parameters

###### keyId

`string`

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<`void`\>\>

***

### assistant

> `readonly` **assistant**: `object`

Defined in: [src/index.ts:153](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L153)

#### chat()

##### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`AssistantResponse`](AssistantResponse.md)\>\>

###### Parameters

###### params

[`AssistantChatParamsNonStreaming`](AssistantChatParamsNonStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`AssistantResponse`](AssistantResponse.md)\>\>

##### Call Signature

> **chat**(`params`, `options?`): `Promise`\<[`Stream`](../classes/Stream.md)\<[`AssistantStreamEvent`](AssistantStreamEvent.md)\>\>

###### Parameters

###### params

[`AssistantChatParamsStreaming`](AssistantChatParamsStreaming.md)

###### options?

[`RequestOptions`](RequestOptions.md)

###### Returns

`Promise`\<[`Stream`](../classes/Stream.md)\<[`AssistantStreamEvent`](AssistantStreamEvent.md)\>\>

***

### health

> `readonly` **health**: `object`

Defined in: [src/index.ts:163](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/index.ts#L163)

#### check()

> **check**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`HealthStatus`](HealthStatus.md)\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`HealthStatus`](HealthStatus.md)\>\>

#### ready()

> **ready**(`options?`): `Promise`\<[`APIResponse`](APIResponse.md)\<[`ReadinessStatus`](ReadinessStatus.md)\>\>

##### Parameters

###### options?

[`RequestOptions`](RequestOptions.md)

##### Returns

`Promise`\<[`APIResponse`](APIResponse.md)\<[`ReadinessStatus`](ReadinessStatus.md)\>\>
