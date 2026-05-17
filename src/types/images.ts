import type { MetadataCarrier } from "./shared.js";

export type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";
export type ImageQuality = "standard" | "hd";
export type ImageResponseFormat = "url" | "b64_json";

export interface ImageGenerationCreateParams {
  model: string;
  prompt: string;
  n?: number;
  size?: ImageSize;
  quality?: ImageQuality;
  responseFormat?: ImageResponseFormat;
}

export interface ImageData {
  url?: string;
  b64Json?: string;
  revisedPrompt?: string;
}

export interface ImageGenerationResponse extends MetadataCarrier {
  created: number;
  data: ImageData[];
}
