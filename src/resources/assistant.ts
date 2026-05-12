import type { VeyraClient } from "../core/client.js";
import type { RequestOptions } from "../core/requestOptions.js";
import { Stream } from "../core/streaming.js";
import type {
  AssistantChatParams,
  AssistantChatParamsNonStreaming,
  AssistantChatParamsStreaming,
  AssistantResponse,
  AssistantStreamEvent,
} from "../types/assistant.js";

export class Assistant {
  constructor(private readonly _client: VeyraClient) {}

  chat(
    params: AssistantChatParamsNonStreaming,
    options?: RequestOptions,
  ): Promise<AssistantResponse>;

  chat(
    params: AssistantChatParamsStreaming,
    options?: RequestOptions,
  ): Promise<Stream<AssistantStreamEvent>>;

  /**
   * @summary Send a message to the Veyra assistant.
   */
  async chat(
    params: AssistantChatParams,
    options?: RequestOptions,
  ): Promise<AssistantResponse | Stream<AssistantStreamEvent>> {
    if (params.stream) {
      const response = await this._client["_requestRaw"](
        "POST",
        "/v1/assistant/chat",
        params,
        undefined,
        options,
      );
      return new Stream<AssistantStreamEvent>(response, (data) => JSON.parse(data) as AssistantStreamEvent);
    }

    return this._client["_request"]<AssistantResponse>(
      "POST",
      "/v1/assistant/chat",
      params,
      undefined,
      options,
    ) as Promise<AssistantResponse>;
  }
}
