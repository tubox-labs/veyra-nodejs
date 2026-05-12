import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import type { HealthStatus, ReadinessStatus } from "../types/misc.js";

export class Health {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Check service health.
   */
  async check(options?: RequestOptions): Promise<HealthStatus> {
    return this._client["_request"]<HealthStatus>(
      "GET",
      "/health",
      undefined,
      undefined,
      options,
    ) as Promise<HealthStatus>;
  }

  /**
   * @summary Check readiness status.
   */
  async ready(options?: RequestOptions): Promise<ReadinessStatus> {
    return this._client["_request"]<ReadinessStatus>(
      "GET",
      "/health/ready",
      undefined,
      undefined,
      options,
    ) as Promise<ReadinessStatus>;
  }
}
