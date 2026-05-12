[**Veyra Node.js SDK v0.1.0**](../README.md)

***

[Veyra Node.js SDK](../globals.md) / Page

# Class: Page\<T\>

Defined in: src/core/pagination.ts:12

An auto-advancing page of items from list endpoints.

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new Page**\<`T`\>(`_fetchPage`, `data`): `Page`\<`T`\>

Defined in: src/core/pagination.ts:20

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

Defined in: src/core/pagination.ts:13

***

### total

> `readonly` **total**: `number`

Defined in: src/core/pagination.ts:14

***

### offset

> `readonly` **offset**: `number`

Defined in: src/core/pagination.ts:15

***

### limit

> `readonly` **limit**: `number`

Defined in: src/core/pagination.ts:16

***

### hasMore

> `readonly` **hasMore**: `boolean`

Defined in: src/core/pagination.ts:17

***

### nextOffset

> `readonly` **nextOffset**: `number` \| `null`

Defined in: src/core/pagination.ts:18

## Methods

### nextPage()

> **nextPage**(): `Promise`\<`Page`\<`T`\> \| `null`\>

Defined in: src/core/pagination.ts:33

Fetch the next page. Returns `null` when there are no more pages.

#### Returns

`Promise`\<`Page`\<`T`\> \| `null`\>

***

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<`T`\>

Defined in: src/core/pagination.ts:39

Iterate all pages, yielding individual items.

#### Returns

`AsyncIterator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### iterPages()

> **iterPages**(): `AsyncGenerator`\<`Page`\<`T`\>\>

Defined in: src/core/pagination.ts:51

Iterate pages as whole Page objects rather than individual items.

#### Returns

`AsyncGenerator`\<`Page`\<`T`\>\>
