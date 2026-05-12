[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / APIResponse

# Interface: APIResponse\<T\>

Defined in: [src/core/response.ts:5](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/response.ts#L5)

Wraps a parsed API response with HTTP metadata.
Returned by any method called through `client.withRawResponse.*`.

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`

Defined in: [src/core/response.ts:7](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/response.ts#L7)

Parsed response body.

***

### requestId

> **requestId**: `string` \| `undefined`

Defined in: [src/core/response.ts:9](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/response.ts#L9)

`X-Request-ID` correlation header from the server.

***

### httpStatus

> **httpStatus**: `number`

Defined in: [src/core/response.ts:11](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/response.ts#L11)

HTTP status code.

***

### headers

> **headers**: `Headers`

Defined in: [src/core/response.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/response.ts#L13)

Full response headers.
