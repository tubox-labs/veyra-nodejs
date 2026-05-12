import type { MetadataCarrier } from "./shared.js";

export type Uploadable =
  | Blob
  | Buffer
  | ReadableStream<Uint8Array>
  | {
      name: string;
      data: Blob | Buffer | ReadableStream<Uint8Array>;
      type?: string;
    };

export interface AudioTranscriptionCreateParams {
  model: string;
  file: Uploadable;
  language?: string;
  prompt?: string;
  responseFormat?: "json" | "text" | "srt" | "vtt";
  temperature?: number;
}

export interface AudioTranscription extends MetadataCarrier {
  text: string;
}
