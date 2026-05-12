import type { MetadataCarrier } from "./shared.js";

export interface APIKey extends MetadataCarrier {
  id: string;
  name: string;
  scopes: string[];
  prefix: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export interface CreateAPIKeyParams {
  name: string;
  scopes: string[];
  expiresInDays?: number;
}

export interface UpdateAPIKeyParams {
  name?: string;
  scopes?: string[];
  isActive?: boolean;
}

export interface CreateAPIKeyResponse extends MetadataCarrier {
  id: string;
  key: string;
  name: string;
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
}
