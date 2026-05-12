[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / makeApiError

# Function: makeApiError()

> **makeApiError**(`options`): [`VeyraAPIError`](../classes/VeyraAPIError.md)

Defined in: src/core/errors.ts:115

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
