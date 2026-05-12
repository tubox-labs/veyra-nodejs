[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / makeApiError

# Function: makeApiError()

> **makeApiError**(`options`): [`VeyraAPIError`](../classes/VeyraAPIError.md)

Defined in: [src/core/errors.ts:115](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/errors.ts#L115)

Map `(status, error.code, headers)` to the most specific error subclass.

## Parameters

### options

#### status?

`number`

#### body

[`ErrorEnvelope`](../interfaces/ErrorEnvelope.md)

#### headers?

`Headers`

#### requestId?

`string`

## Returns

[`VeyraAPIError`](../classes/VeyraAPIError.md)
