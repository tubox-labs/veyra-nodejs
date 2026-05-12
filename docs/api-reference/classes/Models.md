[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Models

# Class: Models

Defined in: [src/resources/models.ts:5](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/models.ts#L5)

## Constructors

### Constructor

> **new Models**(`_client`): `Models`

Defined in: [src/resources/models.ts:6](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/models.ts#L6)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Models`

## Methods

### list()

> **list**(`options?`): `Promise`\<[`ModelList`](../interfaces/ModelList.md)\>

Defined in: [src/resources/models.ts:11](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/models.ts#L11)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`ModelList`](../interfaces/ModelList.md)\>

***

### retrieve()

> **retrieve**(`modelId`, `options?`): `Promise`\<[`ModelInfo`](../interfaces/ModelInfo.md)\>

Defined in: [src/resources/models.ts:18](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/models.ts#L18)

#### Parameters

##### modelId

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`ModelInfo`](../interfaces/ModelInfo.md)\>
