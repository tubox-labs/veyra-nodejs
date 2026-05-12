import type { MetadataCarrier, Usage } from "./shared.js";

export interface ResponseInputText {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ResponseCreateParamsBase {
  model: string;
  input: string | ResponseInputText[];
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface ResponseCreateParamsNonStreaming extends ResponseCreateParamsBase {
  stream?: false;
}

export interface ResponseCreateParamsStreaming extends ResponseCreateParamsBase {
  stream: true;
}

export type ResponseCreateParams = ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming;

export interface ResponseOutputText {
  type: "output_text";
  text: string;
}

export interface ResponseOutputMessage {
  type: "message";
  role: "assistant";
  content: ResponseOutputText[];
}

export interface VeyraResponse extends MetadataCarrier {
  id: string;
  object: "response";
  created: number;
  model: string;
  output: ResponseOutputMessage[];
  usage: Usage | null;
  status: string;
}

export interface ResponseStreamEvent extends MetadataCarrier {
  type: string;
  responseId?: string;
  outputIndex?: number;
  contentIndex?: number;
  delta?: string;
  done?: boolean;
}
