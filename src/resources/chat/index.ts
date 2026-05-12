import type { VeyraClient } from "../../core/client.js";
import { Completions } from "./completions.js";

export class Chat {
  /** `client.chat.completions.create(...)` */
  readonly completions: Completions;

  constructor(client: VeyraClient) {
    this.completions = new Completions(client);
  }
}
