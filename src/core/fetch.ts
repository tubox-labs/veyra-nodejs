export interface RetryDecisionContext {
  response: Response | null;
  error: unknown;
  attempt: number;
  maxRetries: number;
}

export interface FetchWithRetryOptions {
  maxRetries: number;
  shouldRetry: (context: RetryDecisionContext) => boolean;
  retryDelay: (context: Omit<RetryDecisionContext, "maxRetries">) => number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = async (ms: number): Promise<void> => {
  if (ms <= 0) return;
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

export async function fetchWithRetry(
  request: () => Promise<Response>,
  options: FetchWithRetryOptions,
): Promise<Response> {
  const sleep = options.sleep ?? defaultSleep;
  for (let attempt = 0; ; attempt += 1) {
    let response: Response | null = null;
    let error: unknown;

    try {
      response = await request();
    } catch (caught) {
      error = caught;

      if (
        !options.shouldRetry({
          response: null,
          error,
          attempt,
          maxRetries: options.maxRetries,
        })
      ) {
        throw error;
      }

      const delay = options.retryDelay({ response: null, error, attempt });
      await sleep(delay);
      continue;
    }

    if (
      !options.shouldRetry({
        response,
        error,
        attempt,
        maxRetries: options.maxRetries,
      })
    ) {
      return response;
    }

    const delay = options.retryDelay({ response, error, attempt });
    await sleep(delay);
  }
}
