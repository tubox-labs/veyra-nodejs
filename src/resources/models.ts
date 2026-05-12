import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import type { ModelInfo, ModelList } from "../types/models.js";

export class Models {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary List all available models.
   */
  async list(options?: RequestOptions): Promise<ModelList> {
    return this._client["_request"]<ModelList>("GET", "/v1/models", undefined, undefined, options) as Promise<ModelList>;
  }

  /**
   * @summary Retrieve one model by identifier.
   */
  async retrieve(modelId: string, options?: RequestOptions): Promise<ModelInfo> {
    return this._client["_request"]<ModelInfo>(
      "GET",
      `/v1/models/${encodeURIComponent(modelId)}`,
      undefined,
      undefined,
      options,
    ) as Promise<ModelInfo>;
  }
}
