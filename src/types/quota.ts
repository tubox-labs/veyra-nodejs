import type { MetadataCarrier } from "./shared.js";

export interface QuotaLimits {
  dailyTokens: number;
  dailyRequests: number;
  rpm: number;
  tpm: number;
  maxContextTokens: number;
  maxOutputTokens: number;
  monthlySpendUsd?: number;
}

export interface QuotaUsage {
  tokensUsedToday: number;
  tokensRemainingToday?: number;
  requestsUsedToday: number;
  requestsRemainingToday?: number;
  percentageUsed?: number;
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
  timeUntilReset?: string;
}
