[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Health

# Class: Health

Defined in: src/resources/health.ts:5

## Constructors

### Constructor

> **new Health**(`_client`): `Health`

Defined in: src/resources/health.ts:6

#### Parameters

##### \_client

`VeyraClient`

#### Returns

`Health`

## Methods

### check()

> **check**(`options?`): `Promise`\<[`HealthStatus`](../interfaces/HealthStatus.md)\>

Defined in: src/resources/health.ts:11

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`HealthStatus`](../interfaces/HealthStatus.md)\>

***

### ready()

> **ready**(`options?`): `Promise`\<[`ReadinessStatus`](../interfaces/ReadinessStatus.md)\>

Defined in: src/resources/health.ts:24

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<[`ReadinessStatus`](../interfaces/ReadinessStatus.md)\>
