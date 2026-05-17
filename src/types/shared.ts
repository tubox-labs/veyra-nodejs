/** Token usage reported by the API. */
export interface Usage {
  promptTokens?: number;
  completionTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens: number;
  promptTokensDetails?: TokenUsageDetails;
  completionTokensDetails?: TokenUsageDetails;
  inputTokensDetails?: TokenUsageDetails;
  outputTokensDetails?: TokenUsageDetails;
}

export interface TokenUsageDetails {
  cachedTokens?: number;
  reasoningTokens?: number;
  audioTokens?: number;
  acceptedPredictionTokens?: number;
  rejectedPredictionTokens?: number;
  [key: string]: unknown;
}

export interface ErrorDetail {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

export interface MetadataCarrier {
  _raw?: unknown;
}
