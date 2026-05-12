import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import type { QuotaPlan, QuotaStatus } from "../types/quota.js";

export class Quota {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Get the current API key quota status.
   */
  async status(options?: RequestOptions): Promise<QuotaStatus> {
    return this._client["_request"]<QuotaStatus>(
      "GET",
      "/v1/quota/status",
      undefined,
      undefined,
      options,
    ) as Promise<QuotaStatus>;
  }

  /**
   * @summary List available plans for the authenticated user.
   */
  async listPlans(options?: RequestOptions): Promise<QuotaPlan[]> {
    return this._client["_request"]<QuotaPlan[]>(
      "GET",
      "/v1/quota/plans",
      undefined,
      undefined,
      options,
    ) as Promise<QuotaPlan[]>;
  }

  /**
   * @summary List publicly-visible plans.
   */
  async listPublicPlans(options?: RequestOptions): Promise<QuotaPlan[]> {
    return this._client["_request"]<QuotaPlan[]>(
      "GET",
      "/v1/quota/plans/public",
      undefined,
      undefined,
      options,
    ) as Promise<QuotaPlan[]>;
  }
}
