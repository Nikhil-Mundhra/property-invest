import { z } from 'zod';
import { PropertyItemSchema } from './property.contract.ts';

export const RealEstatePortfolioSummarySchema = z.object({
  totalPropertiesCount: z.number().int().min(0),
  ownedPropertiesCount: z.number().int().min(0),
  plannedPropertiesCount: z.number().int().min(0),
  totalPortfolioValueAed: z.number().min(0),
  totalEquityInvestedAed: z.number().min(0),
  totalMortgageBalanceAed: z.number().min(0),
  weightedGrossYieldPct: z.number().min(0),
  weightedNetYieldPct: z.number().min(0),
  totalAnnualNetCashflowAed: z.number(),
  totalMonthlyNetCashflowAed: z.number(),
  totalMonthlyOwnershipCostAed: z.number(),
  goldenVisaEligible: z.boolean(),
  goldenVisaShortfallAed: z.number().min(0),
});
export type RealEstatePortfolioSummary = z.infer<typeof RealEstatePortfolioSummarySchema>;

export const RealEstatePortfolioStateSchema = z.object({
  properties: z.array(PropertyItemSchema),
  summary: RealEstatePortfolioSummarySchema,
});
export type RealEstatePortfolioState = z.infer<typeof RealEstatePortfolioStateSchema>;
