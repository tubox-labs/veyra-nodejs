[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / APIResponse

# Interface: APIResponse\<T\>

Defined in: src/core/response.ts:5

Wraps a parsed API response with HTTP metadata.
Returned by any method called through `client.withRawResponse.*`.

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: src/core/response.ts:7

Parsed response body.

***

### requestId

> **requestId**: `string` \| `undefined`

Defined in: src/core/response.ts:9

`X-Request-ID` correlation header from the server.

***

### httpStatus

> **httpStatus**: `number`

Defined in: src/core/response.ts:11

HTTP status code.

***

### headers

> **headers**: `Headers`

Defined in: src/core/response.ts:13

Full response headers.
