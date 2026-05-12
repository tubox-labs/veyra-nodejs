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
  get withRawResponse(): Veyra {
    return new Veyra(this._cloneClientOptions(true) as ClientOptions & { __rawResponseMode: true });
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
