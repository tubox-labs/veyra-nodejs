import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import { Stream } from "../core/streaming.js";
import type {
  ResponseCreateParams,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseStreamEvent,
  VeyraResponse,
} from "../types/responses.js";

export class Responses {
  constructor(private readonly _client: VeyraClient) {}

  create(
    params: ResponseCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<VeyraResponse>;

  create(
    params: ResponseCreateParamsStreaming,
    options?: RequestOptions,
  ): Promise<Stream<ResponseStreamEvent>>;

  /**
   * @summary Create a response from the Responses API.
   */
  async create(
    params: ResponseCreateParams,
    options?: RequestOptions,
  ): Promise<VeyraResponse | Stream<ResponseStreamEvent>> {
    if (params.stream) {
      const response = await this._client["_requestRaw"](
        "POST",
        "/v1/responses",
        params,
        undefined,
        options,
      );
      return new Stream<ResponseStreamEvent>(response, (data) => JSON.parse(data) as ResponseStreamEvent);
    }

    return this._client["_request"]<VeyraResponse>("POST", "/v1/responses", params, undefined, options) as Promise<VeyraResponse>;
  }
}
