import type { MetadataCarrier, Usage } from "./shared.js";

interface AssistantChatParamsBase {
  message: string;
  history?: AssistantHistoryMessage[];
  model?: string;
  conversationId?: string;
}

export interface AssistantHistoryMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantChatParamsNonStreaming extends AssistantChatParamsBase {
  stream?: false;
}

export interface AssistantChatParamsStreaming extends AssistantChatParamsBase {
  stream: true;
}

export type AssistantChatParams =
  | AssistantChatParamsNonStreaming
  | AssistantChatParamsStreaming;

export interface AssistantResponse extends MetadataCarrier {
  answer: string;
  model: string;
  references: string[];
  blocked: boolean;
  requiresLogin: boolean;
  scopeLimited: boolean;
  id?: string;
  conversationId?: string;
  message?: string;
  usage?: Usage | null;
}

export interface AssistantStreamEvent extends MetadataCarrier {
  type: "meta" | "delta" | "done" | string;
  delta?: string;
  done?: boolean;
  conversationId?: string;
  answer?: string;
  model?: string;
  references?: string[];
  blocked?: boolean;
  requiresLogin?: boolean;
  scopeLimited?: boolean;
}
