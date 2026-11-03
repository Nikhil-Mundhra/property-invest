import { z } from 'zod';
import { CurrencyField } from '../fields/currency.field.ts';

export const ResidencyStatusEnum = z.enum([
  'uae_national',
  'uae_resident',
  'non_resident',
]);
export type ResidencyStatus = z.infer<typeof ResidencyStatusEnum>;

export const InvestmentMotivationEnum = z.enum([
  'wealth_generation',
  'primary_home',
  'golden_visa',
  'portfolio_diversification',
]);
export type InvestmentMotivation = z.infer<typeof InvestmentMotivationEnum>;

export const IncomeBracketEnum = z.enum([
  'under_30k',
  '30k_to_75k',
  '75k_to_150k',
  'above_150k',
]);
export type IncomeBracket = z.infer<typeof IncomeBracketEnum>;

export const InvestorProfileSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  residencyStatus: ResidencyStatusEnum,
  age: z.number().int().min(18).max(100),
  monthlyIncomeBracket: IncomeBracketEnum,
  primaryMotivation: InvestmentMotivationEnum,
  preferredCurrency: CurrencyField.default('AED'),
  completedAt: z.string().optional(),
});
export type InvestorProfile = z.infer<typeof InvestorProfileSchema>;
