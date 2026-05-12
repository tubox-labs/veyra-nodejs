import type { MetadataCarrier, Usage } from "./shared.js";

interface TextCompletionCreateParamsBase {
  model: string;
  prompt: string | string[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stop?: string | string[];
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface TextCompletionCreateParamsNonStreaming extends TextCompletionCreateParamsBase {
  stream?: false;
}

export interface TextCompletionCreateParamsStreaming extends TextCompletionCreateParamsBase {
  stream: true;
}

export type TextCompletionCreateParams =
  | TextCompletionCreateParamsNonStreaming
  | TextCompletionCreateParamsStreaming;

export interface TextCompletionChoice {
  index: number;
  text: string;
  finishReason: string | null;
}

export interface TextCompletion extends MetadataCarrier {
  id: string;
  object: "text_completion";
  created: number;
  model: string;
  choices: TextCompletionChoice[];
  usage: Usage | null;
}

export interface TextCompletionChoiceDelta {
  index: number;
  text?: string;
  finishReason: string | null;
}

export interface TextCompletionChunk extends MetadataCarrier {
  id: string;
  object: "text_completion.chunk";
  created: number;
  model: string;
  choices: TextCompletionChoiceDelta[];
  usage?: Usage | null;
}
