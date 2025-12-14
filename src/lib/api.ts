import { getApiBaseUrl } from './utils';

export interface RFP {
  id: number;
  title: string;
  source: string;
  dueDate: string;
  daysLeft: number;
}

export interface ProductMatch {
  rfpItem: string;
  topMatch: string;
  matchScore: number;
  alternatives: Array<{
    name: string;
    score: number;
  }>;
}

export interface PricingSummary {
  materialCost: number;
  serviceCost: number;
  totalProposalValue: number;
  materialsBreakdown: Array<{
    item: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  servicesBreakdown: Array<{
    item: string;
    hours: number;
    rate: number;
    total: number;
  }>;
}

/**
 * Fetches all RFPs from the backend
 */
export async function getRFPs(): Promise<RFP[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/rfps`);
  if (!response.ok) {
    throw new Error(`Failed to fetch RFPs: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches product matching data from the backend
 */
export async function getProductMatching(): Promise<ProductMatch[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/product-matching`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product matching: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches pricing summary from the backend
 */
export async function getPricingSummary(): Promise<PricingSummary> {
  const response = await fetch(`${getApiBaseUrl()}/api/pricing-summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pricing summary: ${response.statusText}`);
  }
  return response.json();
}

