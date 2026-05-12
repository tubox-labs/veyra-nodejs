import type { MetadataCarrier, Usage } from "./shared.js";

interface AssistantChatParamsBase {
  message: string;
  model?: string;
  conversationId?: string;
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
  id: string;
  conversationId: string;
  message: string;
  usage?: Usage | null;
}

export interface AssistantStreamEvent extends MetadataCarrier {
  type: string;
  delta?: string;
  done?: boolean;
  conversationId?: string;
}
