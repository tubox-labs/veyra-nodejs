import type { VeyraClient } from "../../core/client.js";
import type { RequestOptions } from "../../core/requestOptions.js";
import type {
  BillingAccess,
  BillingProfile,
  BillingProfileUpsertParams,
} from "../../types/billing.js";

export class Profile {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Retrieve billing profile.
   */
  async retrieve(options?: RequestOptions): Promise<BillingProfile | null> {
    return this._client["_request"]<BillingProfile | null>(
      "GET",
      "/v1/billing/profile",
      undefined,
      undefined,
      options,
    ) as Promise<BillingProfile | null>;
  }

  /**
   * @summary Upsert billing profile.
   */
  async upsert(
    params: BillingProfileUpsertParams,
    options?: RequestOptions,
  ): Promise<BillingProfile> {
    return this._client["_request"]<BillingProfile>(
      "PUT",
      "/v1/billing/profile",
      params,
      undefined,
      options,
    ) as Promise<BillingProfile>;
  }

  /**
   * @summary Retrieve billing access status.
   */
  async access(options?: RequestOptions): Promise<BillingAccess> {
    return this._client["_request"]<BillingAccess>(
      "GET",
      "/v1/billing/access",
      undefined,
      undefined,
      options,
    ) as Promise<BillingAccess>;
  }
}
