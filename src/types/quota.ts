import type { MetadataCarrier } from "./shared.js";

export interface QuotaLimits {
  dailyRequests: number;
  dailyTokens: number;
  monthlySpendUsd?: number;
}

export interface QuotaUsage {
  requestsUsedToday: number;
  tokensUsedToday: number;
  spendUsdMonthToDate?: number;
}

export interface QuotaPlan {
  id: string;
  name: string;
  tier: string;
  isPublic: boolean;
  limits: QuotaLimits;
}

export interface QuotaStatus extends MetadataCarrier {
  plan: string;
  limits: QuotaLimits;
  usage: QuotaUsage;
  resetsAt: string;
}
