[**Veyra Node.js SDK v1.0.1**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / makeApiError

# Function: makeApiError()

> **makeApiError**(`options`): [`VeyraAPIError`](../classes/VeyraAPIError.md)

Defined in: [src/core/errors.ts:115](https://github.com/tubox-labs/veyra-nodejs/blob/871a6c1e724391f3c26ecbbdab26c3924bd3bb48/src/core/errors.ts#L115)

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
