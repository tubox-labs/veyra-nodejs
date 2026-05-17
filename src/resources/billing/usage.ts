import type { VeyraClient } from "../../core/client.js";
import { Page } from "../../core/pagination.js";
import type { RequestOptions } from "../../core/requestOptions.js";
import type {
  BillingUsageListParams,
  BillingUsagePage,
  UsageRecord,
  UsageSummary,
} from "../../types/billing.js";

export class Usage {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary List usage records with automatic pagination.
   */
  async list(
    params: BillingUsageListParams = {},
    options?: RequestOptions,
  ): Promise<Page<UsageRecord>> {
    const initialOffset = params.offset ?? 0;
    return this._fetchPage(initialOffset, params, options);
  }

  /**
   * @summary Retrieve current-day usage summary.
   */
  async dailySummary(options?: RequestOptions): Promise<UsageSummary> {
    return this._client["_request"]<UsageSummary>(
      "GET",
      "/v1/billing/usage/summary/daily",
      undefined,
      undefined,
      options,
    ) as Promise<UsageSummary>;
  }

  /**
   * @summary Retrieve monthly usage summary.
   */
  async monthlySummary(
    params: { year?: number; month?: number } = {},
    options?: RequestOptions,
  ): Promise<UsageSummary> {
    return this._client["_request"]<UsageSummary>(
      "GET",
      "/v1/billing/usage/summary/monthly",
      undefined,
      params,
      options,
    ) as Promise<UsageSummary>;
  }

  private async _fetchPage(
    offset: number,
    params: BillingUsageListParams,
    options?: RequestOptions,
  ): Promise<Page<UsageRecord>> {
    const payload = (await this._client["_request"]<BillingUsagePage>(
      "GET",
      "/v1/billing/usage",
      undefined,
      {
        ...params,
        offset,
      },
      options,
    )) as BillingUsagePage;

    return new Page<UsageRecord>(
      (nextOffset) => this._fetchPage(nextOffset, params, options),
      {
        items: payload.items,
        total: payload.total,
        offset: payload.offset,
        limit: payload.limit,
        hasMore: payload.hasMore,
      },
    );
  }
}
