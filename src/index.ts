import { VeyraClient, type ClientOptions } from "./core/client.js";
import { Chat } from "./resources/chat/index.js";
import { Completions } from "./resources/completions.js";
import { Responses } from "./resources/responses.js";
import { Embeddings } from "./resources/embeddings.js";
import { Images } from "./resources/images/index.js";
import { Audio } from "./resources/audio/index.js";
import { Models } from "./resources/models.js";
import { Quota } from "./resources/quota.js";
import { Billing } from "./resources/billing/index.js";
import { APIKeys } from "./resources/apiKeys.js";
import { Assistant } from "./resources/assistant.js";
import { Health } from "./resources/health.js";
import type { APIResponse } from "./core/response.js";
import type { RequestOptions } from "./core/requestOptions.js";
import type { Stream } from "./core/streaming.js";
import type {
  APIKey,
  AssistantChatParamsNonStreaming,
  AssistantChatParamsStreaming,
  AssistantResponse,
  AssistantStreamEvent,
  AudioTranscription,
  AudioTranscriptionCreateParams,
  BillingAccess,
  BillingProfile,
  BillingProfileUpsertParams,
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  CreateAPIKeyParams,
  CreateAPIKeyResponse,
  EmbeddingCreateParams,
  EmbeddingResponse,
  HealthStatus,
  ImageGenerationCreateParams,
  ImageGenerationResponse,
  ModelInfo,
  ModelList,
  QuotaPlan,
  QuotaStatus,
  ReadinessStatus,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseStreamEvent,
  TextCompletion,
  TextCompletionChunk,
  TextCompletionCreateParamsNonStreaming,
  TextCompletionCreateParamsStreaming,
  UpdateAPIKeyParams,
  UsageSummary,
  VeyraResponse,
} from "./types/index.js";
import type { Page } from "./core/pagination.js";
import type { BillingUsageListParams, UsageRecord } from "./types/billing.js";

export interface VeyraWithRawResponse {
  readonly chat: {
    readonly completions: {
      create(
        params: ChatCompletionCreateParamsNonStreaming,
        options?: RequestOptions,
      ): Promise<APIResponse<ChatCompletion>>;
      create(
        params: ChatCompletionCreateParamsStreaming,
        options?: RequestOptions,
      ): Promise<Stream<ChatCompletionChunk>>;
    };
  };
  readonly completions: {
    create(
      params: TextCompletionCreateParamsNonStreaming,
      options?: RequestOptions,
    ): Promise<APIResponse<TextCompletion>>;
    create(
      params: TextCompletionCreateParamsStreaming,
      options?: RequestOptions,
    ): Promise<Stream<TextCompletionChunk>>;
  };
  readonly responses: {
    create(
      params: ResponseCreateParamsNonStreaming,
      options?: RequestOptions,
    ): Promise<APIResponse<VeyraResponse>>;
    create(
      params: ResponseCreateParamsStreaming,
      options?: RequestOptions,
    ): Promise<Stream<ResponseStreamEvent>>;
  };
  readonly embeddings: {
    create(
      params: EmbeddingCreateParams,
      options?: RequestOptions,
    ): Promise<APIResponse<EmbeddingResponse>>;
  };
  readonly images: {
    readonly generations: {
      create(
        params: ImageGenerationCreateParams,
        options?: RequestOptions,
      ): Promise<APIResponse<ImageGenerationResponse>>;
    };
  };
  readonly audio: {
    readonly transcriptions: {
      create(
        params: AudioTranscriptionCreateParams,
        options?: RequestOptions,
      ): Promise<APIResponse<AudioTranscription>>;
    };
  };
  readonly models: {
    list(options?: RequestOptions): Promise<APIResponse<ModelList>>;
    retrieve(modelId: string, options?: RequestOptions): Promise<APIResponse<ModelInfo>>;
  };
  readonly quota: {
    status(options?: RequestOptions): Promise<APIResponse<QuotaStatus>>;
    listPlans(options?: RequestOptions): Promise<APIResponse<QuotaPlan[]>>;
    listPublicPlans(options?: RequestOptions): Promise<APIResponse<QuotaPlan[]>>;
  };
  readonly billing: {
    readonly usage: {
      list(params?: BillingUsageListParams, options?: RequestOptions): Promise<Page<UsageRecord>>;
      dailySummary(options?: RequestOptions): Promise<APIResponse<UsageSummary>>;
      monthlySummary(
        params?: { year?: number; month?: number },
        options?: RequestOptions,
      ): Promise<APIResponse<UsageSummary>>;
    };
    readonly profile: {
      retrieve(options?: RequestOptions): Promise<APIResponse<BillingProfile | null>>;
      upsert(
        params: BillingProfileUpsertParams,
        options?: RequestOptions,
      ): Promise<APIResponse<BillingProfile>>;
      access(options?: RequestOptions): Promise<APIResponse<BillingAccess>>;
    };
  };
  readonly apiKeys: {
    create(
      params: CreateAPIKeyParams,
      options?: RequestOptions,
    ): Promise<APIResponse<CreateAPIKeyResponse>>;
    list(options?: RequestOptions): Promise<APIResponse<APIKey[]>>;
    update(
      keyId: string,
      params: UpdateAPIKeyParams,
      options?: RequestOptions,
    ): Promise<APIResponse<APIKey>>;
    revoke(keyId: string, options?: RequestOptions): Promise<APIResponse<void>>;
  };
  readonly assistant: {
    chat(
      params: AssistantChatParamsNonStreaming,
      options?: RequestOptions,
    ): Promise<APIResponse<AssistantResponse>>;
    chat(
      params: AssistantChatParamsStreaming,
      options?: RequestOptions,
    ): Promise<Stream<AssistantStreamEvent>>;
  };
  readonly health: {
    check(options?: RequestOptions): Promise<APIResponse<HealthStatus>>;
    ready(options?: RequestOptions): Promise<APIResponse<ReadinessStatus>>;
  };
}

export class Veyra extends VeyraClient {
  /** Chat completion endpoints: `client.chat.completions.create(...)` */
  readonly chat: Chat;
  /** Legacy text completion endpoint: `client.completions.create(...)` */
  readonly completions: Completions;
  /** OpenAI Responses API wrapper: `client.responses.create(...)` */
  readonly responses: Responses;
  /** Embedding generation: `client.embeddings.create(...)` */
  readonly embeddings: Embeddings;
  /** Image generation: `client.images.generations.create(...)` */
  readonly images: Images;
  /** Audio transcription: `client.audio.transcriptions.create(...)` */
  readonly audio: Audio;
  /** Model listing and retrieval: `client.models.list()` / `.retrieve(id)` */
  readonly models: Models;
  /** Quota status and plans: `client.quota.status()` */
  readonly quota: Quota;
  /** Billing usage, profile, and access: `client.billing.usage.list()` */
  readonly billing: Billing;
  /** API key management: `client.apiKeys.create(...)` */
  readonly apiKeys: APIKeys;
  /** In-app assistant: `client.assistant.chat(...)` */
  readonly assistant: Assistant;
  /** Platform health checks: `client.health.check()` */
  readonly health: Health;

  constructor(options: ClientOptions = {}) {
    super(options as ClientOptions & { __rawResponseMode?: boolean });
    this.chat = new Chat(this);
    this.completions = new Completions(this);
    this.responses = new Responses(this);
    this.embeddings = new Embeddings(this);
    this.images = new Images(this);
    this.audio = new Audio(this);
    this.models = new Models(this);
    this.quota = new Quota(this);
    this.billing = new Billing(this);
    this.apiKeys = new APIKeys(this);
    this.assistant = new Assistant(this);
    this.health = new Health(this);
  }

  /**
   * Returns a new client variant that resolves to `APIResponse<T>` wrappers.
   */
  get withRawResponse(): VeyraWithRawResponse {
    return new Veyra(
      this._cloneClientOptions(true) as ClientOptions & { __rawResponseMode: true },
    ) as unknown as VeyraWithRawResponse;
  }
}

export default Veyra;

export * from "./types/index.js";
export * from "./core/errors.js";
export * from "./resources/index.js";
export type { ClientOptions } from "./core/client.js";
export type { RequestOptions } from "./core/requestOptions.js";
export type { APIResponse } from "./core/response.js";
export { Stream } from "./core/streaming.js";
export { Page } from "./core/pagination.js";
