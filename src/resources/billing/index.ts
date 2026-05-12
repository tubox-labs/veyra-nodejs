import type { VeyraClient } from "../../core/client.js";
import { Profile } from "./profile.js";
import { Usage } from "./usage.js";

export class Billing {
  readonly usage: Usage;
  readonly profile: Profile;

  constructor(client: VeyraClient) {
    this.usage = new Usage(client);
    this.profile = new Profile(client);
  }
}
