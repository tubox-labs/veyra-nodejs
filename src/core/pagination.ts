export interface RawPageData<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

/**
 * An auto-advancing page of items from list endpoints.
 */
export class Page<T> implements AsyncIterable<T> {
  readonly items: T[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
  readonly hasMore: boolean;
  readonly nextOffset: number | null;

  constructor(
    private readonly _fetchPage: (offset: number) => Promise<Page<T>>,
    data: RawPageData<T>,
  ) {
    this.items = data.items;
    this.total = data.total;
    this.offset = data.offset;
    this.limit = data.limit;
    this.hasMore = data.hasMore;
    this.nextOffset = data.hasMore ? data.offset + data.items.length : null;
  }

  /** Fetch the next page. Returns `null` when there are no more pages. */
  async nextPage(): Promise<Page<T> | null> {
    if (!this.hasMore || this.nextOffset === null) return null;
    return this._fetchPage(this.nextOffset);
  }

  /** Iterate all pages, yielding individual items. */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    yield* this.items;

    if (!this.hasMore) return;

    const next = await this.nextPage();
    if (next) {
      yield* next;
    }
  }

  /** Iterate pages as whole {@link Page} objects rather than individual items. */
  async *iterPages(): AsyncGenerator<Page<T>> {
    yield this;
    let next = await this.nextPage();
    while (next) {
      yield next;
      next = await next.nextPage();
    }
  }
}
