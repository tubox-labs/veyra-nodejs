import type { MetadataCarrier } from "./shared.js";

export interface ModelInfo extends MetadataCarrier {
  id: string;
  object: "model";
  created: number;
  ownedBy: string;
  maxInputTokens?: number;
  maxOutputTokens?: number;
}

export interface ModelList extends MetadataCarrier {
  object: "list";
  data: ModelInfo[];
}
