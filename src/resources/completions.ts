import type { VeyraClient } from "../core/client.js";
import { VeyraError } from "../core/errors.js";
import type { RequestOptions } from "../core/requestOptions.js";
import { Stream } from "../core/streaming.js";
import { parseJsonWithCamelCase } from "../lib/typeUtils.js";
import type {
  TextCompletion,
  TextCompletionChunk,
  TextCompletionCreateParams,
  TextCompletionCreateParamsNonStreaming,
  TextCompletionCreateParamsStreaming,
} from "../types/completions.js";

export class Completions {
  constructor(private readonly _client: VeyraClient) {}

  create(
    params: TextCompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<TextCompletion>;

  create(
    params: TextCompletionCreateParamsStreaming,
    options?: RequestOptions,
  ): Promise<Stream<TextCompletionChunk>>;

  /**
   * @summary Create a legacy text completion.
   */
  async create(
    params: TextCompletionCreateParams,
    options?: RequestOptions,
  ): Promise<TextCompletion | Stream<TextCompletionChunk>> {
    if (Array.isArray(params.prompt) && params.prompt.length > 1) {
      throw new VeyraError("Multi-prompt arrays are not supported.");
    }

    if (params.stream) {
      const response = await this._client["_requestRaw"](
        "POST",
        "/v1/completions",
        params,
        undefined,
        options,
      );
      return new Stream<TextCompletionChunk>(response, (data) =>
        parseJsonWithCamelCase<TextCompletionChunk>(data),
      );
    }

    return this._client["_request"]<TextCompletion>(
      "POST",
      "/v1/completions",
      params,
      undefined,
      options,
    ) as Promise<TextCompletion>;
  }
}
