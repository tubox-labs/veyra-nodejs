import type { MetadataCarrier, Usage } from "./shared.js";

export interface SystemMessage {
  role: "system";
  content: string;
}

export interface UserMessage {
  role: "user";
  content: string;
}

export interface AssistantMessage {
  role: "assistant";
  content: string;
}

export type ChatCompletionMessageParam = SystemMessage | UserMessage | AssistantMessage;

interface ChatCompletionCreateParamsBase {
  model: string;
  messages: ChatCompletionMessageParam[];
  temperature?: number;
  topP?: number;
  maxCompletionTokens?: number;
  stop?: string | string[];
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ChatCompletionCreateParamsNonStreaming extends ChatCompletionCreateParamsBase {
  stream?: false;
}

export interface ChatCompletionCreateParamsStreaming extends ChatCompletionCreateParamsBase {
  stream: true;
}

export type ChatCompletionCreateParams =
  | ChatCompletionCreateParamsNonStreaming
  | ChatCompletionCreateParamsStreaming;

export interface ChatCompletionMessage {
  role: "assistant";
  content: string | null;
}

export interface Choice {
  index: number;
  message: ChatCompletionMessage;
  finishReason: string | null;
}

export interface ChatCompletion extends MetadataCarrier {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage | null;
  systemFingerprint: string | null;
}

export interface ChoiceDelta {
  role?: string;
  content?: string | null;
}

export interface StreamChoice {
  index: number;
  delta: ChoiceDelta;
  finishReason: string | null;
}

export interface ChatCompletionChunk extends MetadataCarrier {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: StreamChoice[];
  usage?: Usage | null;
}
