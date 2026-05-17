import type { MetadataCarrier } from "./shared.js";

export interface UsageRecord extends MetadataCarrier {
  id: string;
  userId?: string;
  userEmail?: string;
  userUsername?: string;
  createdAt: string;
  model: string;
  endpoint?: string;
  requestType?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cachedTokens?: number;
  inputCostUsd?: number;
  outputCostUsd?: number;
  cachedCostUsd?: number;
  extrasCostUsd?: number;
  costUsd: number;
  totalCostUsd?: number;
  promptRatePerMillion?: number;
  completionRatePerMillion?: number;
  cachedRatePerMillion?: number;
  pricingProfile?: string;
  pricingProfileVersion?: string;
  pricingSource?: string;
  pricingMultiplier?: number;
  billingStatus?: string;
  calculationMethod?: string;
  conversationId?: string | null;
  latencyMs?: number;
  statusCode: number;
  errorCode?: string | null;
  requestId?: string | null;
  ipAddress?: string | null;
}

export interface UsageSummary extends MetadataCarrier {
  from?: string;
  to?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cachedTokens?: number;
  totalCostUsd?: number;
  requestCount: number;
  totalRequests?: number;
}

export interface BillingProfile extends MetadataCarrier {
  id?: string;
  billingEmail?: string;
  fullName?: string;
  companyName?: string | null;
  countryCode?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  stateRegion?: string;
  postalCode?: string;
  taxId?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  cardExpMonth?: number | null;
  cardExpYear?: number | null;
  updatedAt?: string;
  organizationName?: string;
  contactName?: string;
  contactEmail?: string;
  country?: string;
}

export interface BillingAccess extends MetadataCarrier {
  plan?: string;
  billingRequired?: boolean;
  canUseModels?: boolean;
  reason?: string;
  hasAccess?: boolean;
}

export interface BillingProfileAddressUpsertParams {
  billingEmail: string;
  fullName: string;
  countryCode: string;
  line1: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  companyName?: string | null;
  line2?: string | null;
  taxId?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  cardExpMonth?: number | null;
  cardExpYear?: number | null;
}

export interface LegacyBillingProfileUpsertParams {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  taxId?: string;
}

export type BillingProfileUpsertParams =
  | BillingProfileAddressUpsertParams
  | LegacyBillingProfileUpsertParams;

export interface BillingUsageListParams {
  limit?: number;
  offset?: number;
  since?: string;
  until?: string;
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
