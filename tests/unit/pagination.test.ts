import { describe, expect, it } from "vitest";
import { Page } from "../../src/core/pagination.js";

describe("Page", () => {
  it("handles single-page iteration", async () => {
    const page = new Page<number>(
      async () =>
        new Page(async () => {
          throw new Error("should not fetch");
        }, { items: [], total: 2, offset: 2, limit: 2, hasMore: false }),
      { items: [1, 2], total: 2, offset: 0, limit: 2, hasMore: false },
    );

    const all: number[] = [];
    for await (const item of page) {
      all.push(item);
    }

    expect(all).toEqual([1, 2]);
    expect(await page.nextPage()).toBeNull();
  });

  it("auto-advances across pages", async () => {
    const page2 = new Page<number>(
      async () => {
        throw new Error("exhausted");
      },
      { items: [3, 4], total: 4, offset: 2, limit: 2, hasMore: false },
    );

    const page1 = new Page<number>(async () => page2, {
      items: [1, 2],
      total: 4,
      offset: 0,
      limit: 2,
      hasMore: true,
    });

    const items: number[] = [];
    for await (const item of page1) {
      items.push(item);
    }

    expect(items).toEqual([1, 2, 3, 4]);
    expect(page1.total).toBe(4);
  });

  it("iterPages yields page objects", async () => {
    const page2 = new Page<number>(
      async () => {
        throw new Error("done");
      },
      { items: [2], total: 2, offset: 1, limit: 1, hasMore: false },
    );

    const page1 = new Page<number>(async () => page2, {
      items: [1],
      total: 2,
      offset: 0,
      limit: 1,
      hasMore: true,
    });

    const pages: number[][] = [];
    for await (const page of page1.iterPages()) {
      pages.push(page.items);
    }

    expect(pages).toEqual([[1], [2]]);
  });
});
