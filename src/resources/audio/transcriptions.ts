import type { VeyraClient } from "../../core/client.js";
import { buildFormData } from "../../core/multipart.js";
import type { RequestOptions } from "../../core/requestOptions.js";
import type { AudioTranscription, AudioTranscriptionCreateParams } from "../../types/audio.js";

export class Transcriptions {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Create a transcription from an audio file.
   */
  async create(
    params: AudioTranscriptionCreateParams,
    options?: RequestOptions,
  ): Promise<AudioTranscription> {
    const form = await buildFormData(params as unknown as Record<string, unknown>, "file");
    return this._client["_request"]<AudioTranscription>(
      "POST",
      "/v1/audio/transcriptions",
      form,
      undefined,
      options,
    ) as Promise<AudioTranscription>;
  }
}
