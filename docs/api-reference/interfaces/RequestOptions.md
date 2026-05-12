[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / RequestOptions

# Interface: RequestOptions

Defined in: [src/core/requestOptions.ts:4](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L4)

Per-request overrides that can be passed to any SDK method as the last argument.

## Properties

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [src/core/requestOptions.ts:9](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L9)

Additional HTTP headers merged on top of the client defaults.
These take precedence over client-level `defaultHeaders`.

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [src/core/requestOptions.ts:15](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L15)

Request timeout in milliseconds.
Overrides the client-level `timeout` for this single request.

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [src/core/requestOptions.ts:21](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L21)

Override the number of automatic retries for this single request.
Pass `0` to disable retries.

***

### baseURL?

> `optional` **baseURL?**: `string`

Defined in: [src/core/requestOptions.ts:27](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L27)

Override the base URL for this single request.
Useful for region-specific routing.

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [src/core/requestOptions.ts:33](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/requestOptions.ts#L33)

Abort signal. When the signal fires the in-flight request is cancelled
and a [VeyraAPIConnectionAbortedError](../classes/VeyraAPIConnectionAbortedError.md) is thrown.
