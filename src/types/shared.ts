/** Token usage reported by the API. */
export interface Usage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
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
