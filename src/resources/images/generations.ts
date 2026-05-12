import type { VeyraClient } from "../../core/client.js";
import { VeyraError } from "../../core/errors.js";
import type { RequestOptions } from "../../core/requestOptions.js";
import type { ImageGenerationCreateParams, ImageGenerationResponse } from "../../types/images.js";

const VALID_SIZES = new Set(["1024x1024", "1024x1792", "1792x1024"]);
const VALID_QUALITIES = new Set(["standard", "hd"]);

export class Generations {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Generate one or more images from a prompt.
   */
  async create(
    params: ImageGenerationCreateParams,
    options?: RequestOptions,
  ): Promise<ImageGenerationResponse> {
    validateImageParams(params);

    return this._client["_request"]<ImageGenerationResponse>(
      "POST",
      "/v1/images/generations",
      params,
      undefined,
      options,
    ) as Promise<ImageGenerationResponse>;
  }
}

function validateImageParams(params: ImageGenerationCreateParams): void {
  if (params.n !== undefined && (params.n < 1 || params.n > 10)) {
    throw new VeyraError("Image generation parameter 'n' must be between 1 and 10.");
  }

  if (params.size !== undefined && !VALID_SIZES.has(params.size)) {
    throw new VeyraError(
      "Image generation parameter 'size' must be one of: 1024x1024, 1024x1792, 1792x1024.",
    );
  }

  if (params.quality !== undefined && !VALID_QUALITIES.has(params.quality)) {
    throw new VeyraError("Image generation parameter 'quality' must be either 'standard' or 'hd'.");
  }
}
