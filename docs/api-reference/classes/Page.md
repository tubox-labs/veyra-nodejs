[**Veyra Node.js SDK v1.0.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Page

# Class: Page\<T\>

Defined in: [src/core/pagination.ts:12](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L12)

An auto-advancing page of items from list endpoints.

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new Page**\<`T`\>(`_fetchPage`, `data`): `Page`\<`T`\>

Defined in: [src/core/pagination.ts:20](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L20)

#### Parameters

##### \_fetchPage

(`offset`) => `Promise`\<`Page`\<`T`\>\>

##### data

`RawPageData`\<`T`\>

#### Returns

`Page`\<`T`\>

## Properties

### items

> `readonly` **items**: `T`[]

Defined in: [src/core/pagination.ts:13](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L13)

***

### total

> `readonly` **total**: `number`

Defined in: [src/core/pagination.ts:14](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L14)

***

### offset

> `readonly` **offset**: `number`

Defined in: [src/core/pagination.ts:15](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L15)

***

### limit

> `readonly` **limit**: `number`

Defined in: [src/core/pagination.ts:16](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L16)

***

### hasMore

> `readonly` **hasMore**: `boolean`

Defined in: [src/core/pagination.ts:17](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L17)

***

### nextOffset

> `readonly` **nextOffset**: `number` \| `null`

Defined in: [src/core/pagination.ts:18](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L18)

## Methods

### nextPage()

> **nextPage**(): `Promise`\<`Page`\<`T`\> \| `null`\>

Defined in: [src/core/pagination.ts:33](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L33)

Fetch the next page. Returns `null` when there are no more pages.

#### Returns

`Promise`\<`Page`\<`T`\> \| `null`\>

***

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<`T`\>

Defined in: [src/core/pagination.ts:39](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L39)

Iterate all pages, yielding individual items.

#### Returns

`AsyncIterator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### iterPages()

> **iterPages**(): `AsyncGenerator`\<`Page`\<`T`\>\>

Defined in: [src/core/pagination.ts:51](https://github.com/tubox-labs/veyra-nodejs/blob/5b58b1304854b72776ec2ad1c66004804c3609a6/src/core/pagination.ts#L51)

Iterate pages as whole Page objects rather than individual items.

#### Returns

`AsyncGenerator`\<`Page`\<`T`\>\>
