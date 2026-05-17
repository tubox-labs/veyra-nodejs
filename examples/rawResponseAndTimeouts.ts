import Veyra from "@tubox/veyra-sdk";

const client = new Veyra({
  timeout: 20_000,
  maxRetries: 2,
  defaultHeaders: { "X-Example": "raw-response" },
});

const raw = await client.withRawResponse.models.list({
  timeout: 10_000,
  maxRetries: 0,
  headers: { "X-Request-ID": `example_${Date.now()}` },
});

console.log("status", raw.httpStatus);
console.log("request", raw.requestId);
console.log("models", raw.data.data.map((model) => model.id));
