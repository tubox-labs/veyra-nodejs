import type { MetadataCarrier, Usage } from "./shared.js";

export interface EmbeddingCreateParams {
  model: string;
  input: string | string[];
}

export interface EmbeddingData {
  object: "embedding";
  index: number;
  embedding: number[];
}

export interface EmbeddingResponse extends MetadataCarrier {
  object: "list";
  model: string;
  data: EmbeddingData[];
  usage: Usage | null;
}
