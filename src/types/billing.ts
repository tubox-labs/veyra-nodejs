import type { MetadataCarrier } from "./shared.js";

export interface UsageRecord extends MetadataCarrier {
  id: string;
  createdAt: string;
  model: string;
  requestType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  statusCode: number;
}

export interface UsageSummary extends MetadataCarrier {
  from: string;
  to: string;
  totalRequests: number;
  totalTokens: number;
  totalCostUsd: number;
}

export interface BillingProfile extends MetadataCarrier {
  id: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  taxId?: string;
}

export interface BillingAccess extends MetadataCarrier {
  hasAccess: boolean;
  reason?: string;
}

export interface BillingProfileUpsertParams {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  taxId?: string;
}

export interface BillingUsageListParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  model?: string;
}

export interface BillingUsagePage extends MetadataCarrier {
  items: UsageRecord[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}
