import type { VeyraClient } from "../../core/client.js";
import { Transcriptions } from "./transcriptions.js";

export class Audio {
  readonly transcriptions: Transcriptions;

  constructor(client: VeyraClient) {
    this.transcriptions = new Transcriptions(client);
  }
}
