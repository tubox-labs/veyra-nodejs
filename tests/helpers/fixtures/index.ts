export const chatFixture = {
  id: "chatcmpl_1",
  object: "chat.completion",
  created: 1710000000,
  model: "gpt-5.4-mini",
  choices: [
    {
      index: 0,
      message: { role: "assistant", content: "Hello from Veyra" },
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 5,
    total_tokens: 15,
  },
  system_fingerprint: null,
} as const;

export const completionsFixture = {
  id: "cmpl_1",
  object: "text_completion",
  created: 1710000000,
  model: "gpt-5.4-mini",
  choices: [{ index: 0, text: "Legacy completion", finish_reason: "stop" }],
  usage: {
    prompt_tokens: 5,
    completion_tokens: 3,
    total_tokens: 8,
  },
} as const;

export const responsesFixture = {
  id: "resp_1",
  object: "response",
  created_at: 1710000000,
  error: null,
  incomplete_details: null,
  instructions: "Be concise",
  metadata: null,
  model: "gpt-5.4-mini",
  status: "completed",
  output: [
    {
      id: "rs_1",
      type: "reasoning",
      status: "completed",
      summary: [{ type: "summary_text", text: "Checked the instruction." }],
    },
    {
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: "Response output" }],
    },
  ],
  parallel_tool_calls: true,
  temperature: null,
  tool_choice: "auto",
  tools: [],
  top_p: null,
  max_output_tokens: 128,
  usage: {
    input_tokens: 4,
    input_tokens_details: { cached_tokens: 1 },
    output_tokens: 6,
    output_tokens_details: { reasoning_tokens: 2 },
    total_tokens: 10,
  },
} as const;

export const embeddingsFixture = {
  object: "list",
  model: "text-embedding-3-small",
  data: [{ object: "embedding", index: 0, embedding: [0.1, 0.2, 0.3] }],
  usage: {
    prompt_tokens: 2,
    completion_tokens: 0,
    total_tokens: 2,
  },
} as const;

export const imagesFixture = {
  created: 1710000000,
  data: [{ url: "https://example.com/image.png" }],
} as const;

export const audioFixture = { text: "transcribed text" } as const;

export const modelsFixture = {
  object: "list",
  data: [
    {
      id: "gpt-5.4-mini",
      object: "model",
      created: 1710000000,
      owned_by: "veyra",
    },
  ],
} as const;

export const quotaFixture = {
  plan: "pro",
  limits: {
    daily_requests: 1000,
    daily_tokens: 100000,
  },
  usage: {
    requests_used_today: 100,
    tokens_used_today: 5000,
  },
  resets_at: "2026-05-13T00:00:00Z",
} as const;

export const billingFixture = {
  prompt_tokens: 7200,
  completion_tokens: 4800,
  total_tokens: 12000,
  request_count: 200,
  total_cost_usd: 42.5,
} as const;

export const billingUsagePage1Fixture = {
  items: [
    {
      id: "u_1",
      created_at: "2026-05-10T10:00:00Z",
      model: "gpt-5.4-mini",
      request_type: "chat",
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
      cost_usd: 0.02,
      status_code: 200,
    },
  ],
  total: 2,
  offset: 0,
  limit: 1,
  has_more: true,
} as const;

export const billingUsagePage2Fixture = {
  items: [
    {
      id: "u_2",
      created_at: "2026-05-10T11:00:00Z",
      model: "gpt-5.4-mini",
      request_type: "chat",
      prompt_tokens: 12,
      completion_tokens: 4,
      total_tokens: 16,
      cost_usd: 0.03,
      status_code: 200,
    },
  ],
  total: 2,
  offset: 1,
  limit: 1,
  has_more: false,
} as const;

export const apiKeysFixture = [
  {
    id: "key_1",
    name: "ci",
    scopes: ["chat:write"],
    prefix: "veyra_sk_",
    is_active: true,
    created_at: "2026-05-10T00:00:00Z",
  },
] as const;

export const assistantFixture = {
  answer: "Assistant reply",
  model: "account-context",
  references: ["account:model-access"],
  blocked: false,
  requires_login: false,
  scope_limited: false,
} as const;

export const healthFixture = {
  status: "ok",
  version: "1.0.0",
  timestamp: "2026-05-12T00:00:00Z",
} as const;
