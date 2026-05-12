/**
 * Wraps a parsed API response with HTTP metadata.
 * Returned by any method called through `client.withRawResponse.*`.
 */
export interface APIResponse<T> {
  /** Parsed response body. */
  data: T;
  /** `X-Request-ID` correlation header from the server. */
  requestId: string | undefined;
  /** HTTP status code. */
  httpStatus: number;
  /** Full response headers. */
  headers: Headers;
}
