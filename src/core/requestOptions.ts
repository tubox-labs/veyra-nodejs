/**
 * Per-request overrides that can be passed to any SDK method as the last argument.
 */
export interface RequestOptions {
  /**
   * Additional HTTP headers merged on top of the client defaults.
   * These take precedence over client-level `defaultHeaders`.
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds.
   * Overrides the client-level `timeout` for this single request.
   */
  timeout?: number;

  /**
   * Override the number of automatic retries for this single request.
   * Pass `0` to disable retries.
   */
  maxRetries?: number;

  /**
   * Override the base URL for this single request.
   * Useful for region-specific routing.
   */
  baseURL?: string;

  /**
   * Abort signal. When the signal fires the in-flight request is cancelled
   * and a {@link VeyraAPIConnectionAbortedError} is thrown.
   */
  signal?: AbortSignal;
}
