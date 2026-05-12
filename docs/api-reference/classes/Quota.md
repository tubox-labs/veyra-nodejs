[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Quota

# Class: Quota

Defined in: src/resources/quota.ts:5

## Constructors

### Constructor

> **new Quota**(`_client`): `Quota`

Defined in: src/resources/quota.ts:6

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Quota`

## Methods

### status()

> **status**(`options?`): `Promise`\<[`QuotaStatus`](../interfaces/QuotaStatus.md)\>

Defined in: src/resources/quota.ts:11

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaStatus`](../interfaces/QuotaStatus.md)\>

***

### listPlans()

> **listPlans**(`options?`): `Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

Defined in: src/resources/quota.ts:24

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

***

### listPublicPlans()

> **listPublicPlans**(`options?`): `Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>

Defined in: src/resources/quota.ts:37

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`QuotaPlan`](../interfaces/QuotaPlan.md)[]\>
