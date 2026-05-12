import type { VeyraClient } from "../../core/client.js";
import { Generations } from "./generations.js";

export class Images {
  readonly generations: Generations;

  constructor(client: VeyraClient) {
    this.generations = new Generations(client);
  }
}
