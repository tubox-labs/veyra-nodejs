import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import type {
  APIKey,
  CreateAPIKeyParams,
  CreateAPIKeyResponse,
  UpdateAPIKeyParams,
} from "../types/apiKeys.js";

export class APIKeys {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Create an API key.
   */
  async create(
    params: CreateAPIKeyParams,
    options?: RequestOptions,
  ): Promise<CreateAPIKeyResponse> {
    return this._client["_request"]<CreateAPIKeyResponse>(
      "POST",
      "/v1/api-keys",
      params,
      undefined,
      options,
    ) as Promise<CreateAPIKeyResponse>;
  }

  /**
   * @summary List API keys.
   */
  async list(options?: RequestOptions): Promise<APIKey[]> {
    return this._client["_request"]<APIKey[]>(
      "GET",
      "/v1/api-keys",
      undefined,
      undefined,
      options,
    ) as Promise<APIKey[]>;
  }

  /**
   * @summary Update an API key.
   */
  async update(
    keyId: string,
    params: UpdateAPIKeyParams,
    options?: RequestOptions,
  ): Promise<APIKey> {
    return this._client["_request"]<APIKey>(
      "PATCH",
      `/v1/api-keys/${encodeURIComponent(keyId)}`,
      params,
      undefined,
      options,
    ) as Promise<APIKey>;
  }

  /**
   * @summary Revoke an API key.
   */
  async revoke(keyId: string, options?: RequestOptions): Promise<void> {
    await this._client["_request"]<void>(
      "DELETE",
      `/v1/api-keys/${encodeURIComponent(keyId)}`,
      undefined,
      undefined,
      options,
    );
  }
}
