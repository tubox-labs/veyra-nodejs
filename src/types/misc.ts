import type { MetadataCarrier } from "./shared.js";

export interface HealthStatus extends MetadataCarrier {
  status: "ok" | "degraded" | "down";
  version?: string;
  timestamp?: string;
}

export interface ReadinessStatus extends MetadataCarrier {
  ready: boolean;
  checks: Record<string, string>;
}
