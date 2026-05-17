import type { MetadataCarrier, Usage } from "./shared.js";
import type { ReasoningConfig, ResponseFormat } from "./chat.js";

export interface ResponseInputMessage {
  role: "user" | "assistant" | "system";
  content: string | ResponseInputContent[];
  type?: "message";
}

export interface ResponseInputText {
  type: "input_text";
  text: string;
}

export type ResponseInputContent = ResponseInputText | { type: string; [key: string]: unknown };

export type ResponseInput =
  | string
  | ResponseInputMessage
  | Array<string | ResponseInputMessage | ResponseInputText>;

interface ResponseCreateParamsBase {
  model: string;
  input: ResponseInput;
  instructions?: string;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseFormat?: ResponseFormat;
  reasoning?: ReasoningConfig;
  parallelToolCalls?: boolean;
  truncation?: "auto" | "disabled" | (string & Record<never, never>);
  metadata?: Record<string, string | number | boolean | null>;
  user?: string;
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
  annotations?: Array<Record<string, unknown>>;
}

export interface ResponseOutputMessage {
  id?: string;
  type: "message";
  status?: string;
  role: "assistant";
  content: ResponseOutputText[];
}

export interface ResponseReasoningSummaryText {
  type: "summary_text";
  text: string;
}

export interface ResponseReasoningItem {
  id?: string;
  type: "reasoning";
  status?: string;
  summary?: ResponseReasoningSummaryText[];
  encryptedContent?: string | null;
}

export type ResponseOutputItem =
  | ResponseOutputMessage
  | ResponseReasoningItem;

export interface VeyraResponse extends MetadataCarrier {
  id: string;
  object: "response";
  created?: number;
  createdAt?: number;
  error?: unknown;
  incompleteDetails?: unknown;
  instructions?: string | null;
  metadata?: Record<string, unknown> | null;
  model: string;
  output: ResponseOutputItem[];
  parallelToolCalls?: boolean;
  temperature?: number | null;
  toolChoice?: string | Record<string, unknown> | null;
  tools?: Array<Record<string, unknown>>;
  topP?: number | null;
  maxOutputTokens?: number | null;
  usage: Usage | null;
  status: string;
  user?: string | null;
}

export interface ResponseStreamEvent extends MetadataCarrier {
  type: string;
  responseId?: string;
  response?: VeyraResponse;
  itemId?: string;
  item?: ResponseOutputItem;
  outputIndex?: number;
  contentIndex?: number;
  delta?: string;
  text?: string;
  done?: boolean;
  sequenceNumber?: number;
}
