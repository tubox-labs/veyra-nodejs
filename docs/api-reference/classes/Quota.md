[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Quota

# Class: Quota

Defined in: [src/resources/quota.ts:5](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/quota.ts#L5)

## Constructors

### Constructor

> **new Quota**(`_client`): `Quota`

Defined in: [src/resources/quota.ts:6](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/quota.ts#L6)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Quota`

## Methods

### status()

> **status**(`options?`): `Promise`\<[`QuotaStatus`](../interfaces/QuotaStatus.md)\>

Defined in: [src/resources/quota.ts:11](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/quota.ts#L11)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaStatus`](../interfaces/QuotaStatus.md)\>

***

### listPlans()

> **listPlans**(`options?`): `Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

Defined in: [src/resources/quota.ts:24](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/quota.ts#L24)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

***

### listPublicPlans()

> **listPublicPlans**(`options?`): `Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

Defined in: [src/resources/quota.ts:37](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/quota.ts#L37)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>
