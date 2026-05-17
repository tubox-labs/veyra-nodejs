import type { VeyraClient } from "../../core/client.js";
import type { RequestOptions } from "../../core/requestOptions.js";
import { Stream } from "../../core/streaming.js";
import { parseJsonWithCamelCase } from "../../lib/typeUtils.js";
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from "../../types/chat.js";

export class Completions {
  constructor(private readonly _client: VeyraClient) {}

  create(
    params: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<ChatCompletion>;

  create(
    params: ChatCompletionCreateParamsStreaming,
    options?: RequestOptions,
  ): Promise<Stream<ChatCompletionChunk>>;

  /**
   * @summary Create a chat completion.
   */
  async create(
    params: ChatCompletionCreateParams,
    options?: RequestOptions,
  ): Promise<ChatCompletion | Stream<ChatCompletionChunk>> {
    if (params.stream) {
      const response = await this._client["_requestRaw"](
        "POST",
        "/v1/chat/completions",
        params,
        undefined,
        options,
      );
      return new Stream<ChatCompletionChunk>(response, (data) =>
        parseJsonWithCamelCase<ChatCompletionChunk>(data),
      );
    }

    return this._client["_request"]<ChatCompletion>(
      "POST",
      "/v1/chat/completions",
      params,
      undefined,
      options,
    ) as Promise<ChatCompletion>;
  }
}
