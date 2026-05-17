import Veyra, {
  VeyraAPIConnectionError,
  VeyraAPIError,
  VeyraRateLimitError,
  VeyraUnprocessableEntityError,
} from "@tubox/veyra-sdk";

const client = new Veyra({ maxRetries: 1 });

try {
  await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: "Say hello." }],
    maxCompletionTokens: 32,
  });
} catch (error) {
  if (error instanceof VeyraRateLimitError) {
    console.error("rate limited", { retryAfter: error.retryAfter, requestId: error.requestId });
  } else if (error instanceof VeyraUnprocessableEntityError) {
    console.error("validation failed", error.details);
  } else if (error instanceof VeyraAPIError) {
    console.error("api error", {
      status: error.httpStatus,
      code: error.code,
      requestId: error.requestId,
    });
  } else if (error instanceof VeyraAPIConnectionError) {
    console.error("connection error", error.cause);
  } else {
    throw error;
  }
}
