[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Health

# Class: Health

Defined in: [src/resources/health.ts:5](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/health.ts#L5)

## Constructors

### Constructor

> **new Health**(`_client`): `Health`

Defined in: [src/resources/health.ts:6](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/health.ts#L6)

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Health`

## Methods

### check()

> **check**(`options?`): `Promise`\<[`HealthStatus`](../interfaces/HealthStatus.md)\>

Defined in: [src/resources/health.ts:11](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/health.ts#L11)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`HealthStatus`](../interfaces/HealthStatus.md)\>

***

### ready()

> **ready**(`options?`): `Promise`\<[`ReadinessStatus`](../interfaces/ReadinessStatus.md)\>

Defined in: [src/resources/health.ts:24](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/resources/health.ts#L24)

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`ReadinessStatus`](../interfaces/ReadinessStatus.md)\>
