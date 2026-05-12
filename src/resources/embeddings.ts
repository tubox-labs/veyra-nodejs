import type { VeyraClient } from "../core/client.js";
import { VeyraError } from "../core/errors.js";
import type { RequestOptions } from "../core/requestOptions.js";
import type { EmbeddingCreateParams, EmbeddingResponse } from "../types/embeddings.js";

const MAX_EMBEDDING_INPUT_LENGTH = 30_000;
const MAX_EMBEDDING_ITEMS = 256;

export class Embeddings {
  constructor(private readonly _client: VeyraClient) {}

  /**
   * @summary Create embeddings for a string or array of strings.
   */
  async create(params: EmbeddingCreateParams, options?: RequestOptions): Promise<EmbeddingResponse> {
    validateEmbeddingInput(params.input);
    return this._client["_request"]<EmbeddingResponse>(
      "POST",
      "/v1/embeddings",
      params,
      undefined,
      options,
    ) as Promise<EmbeddingResponse>;
  }
}

function validateEmbeddingInput(input: string | string[]): void {
  if (typeof input === "string") {
    if (input.length > MAX_EMBEDDING_INPUT_LENGTH) {
      throw new VeyraError(
        `Embedding input exceeds ${MAX_EMBEDDING_INPUT_LENGTH.toLocaleString()} characters.`,
      );
    }
    return;
  }

  if (input.length === 0) {
    throw new VeyraError("Embedding input array cannot be empty.");
  }

  if (input.length > MAX_EMBEDDING_ITEMS) {
    throw new VeyraError(`Embedding input array cannot exceed ${MAX_EMBEDDING_ITEMS} items.`);
  }

  for (const [index, item] of input.entries()) {
    if (item.length > MAX_EMBEDDING_INPUT_LENGTH) {
      throw new VeyraError(
        `Embedding input at index ${index} exceeds ${MAX_EMBEDDING_INPUT_LENGTH.toLocaleString()} characters.`,
      );
    }
  }
}
