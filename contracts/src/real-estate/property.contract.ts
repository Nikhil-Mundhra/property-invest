import { z } from 'zod';

export const PropertyTypeEnum = z.enum([
  'apartment',
  'villa',
  'townhouse',
  'penthouse',
  'commercial',
]);
export type PropertyType = z.infer<typeof PropertyTypeEnum>;

export const PropertyStatusEnum = z.enum(['owned', 'planned']);
export type PropertyStatus = z.infer<typeof PropertyStatusEnum>;

export const AcquisitionIntentEnum = z.enum(['investment', 'personal_home', 'hybrid']);
export type AcquisitionIntent = z.infer<typeof AcquisitionIntentEnum>;

export const FinancingTypeEnum = z.enum(['cash', 'mortgage']);
export type FinancingType = z.infer<typeof FinancingTypeEnum>;

export const OffPlanMilestoneSchema = z.object({
  milestone: z.string(),
  percentage: z.number().min(0).max(100),
  dueLabel: z.string().optional(),
});
export type OffPlanMilestone = z.infer<typeof OffPlanMilestoneSchema>;

export const PropertyItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  developer: z.string().min(1),
  propertyType: PropertyTypeEnum,
  status: PropertyStatusEnum,
  intent: AcquisitionIntentEnum,
  bedrooms: z.number().min(0).max(10), // 0 = Studio
  bathrooms: z.number().min(1).max(12),
  sqft: z.number().positive(),
  priceAed: z.number().positive(),
  financingType: FinancingTypeEnum.default('cash'),
  downPaymentAed: z.number().min(0).optional(),
  mortgageLoanAmountAed: z.number().min(0).optional(),
  mortgageInterestRatePct: z.number().min(0).max(20).optional(),
  mortgageTenureYears: z.number().min(1).max(30).optional(),
  expectedAnnualRentAed: z.number().min(0).optional(),
  annualServiceChargePerSqft: z.number().min(0).optional(),
  isOffPlan: z.boolean().default(false),
  isDirectDeveloperPurchase: z.boolean().default(false),
  completionYear: z.number().int().min(2020).max(2035).optional(),
  paymentPlan: z.array(OffPlanMilestoneSchema).optional(),
  notes: z.string().max(1000).optional(),
  imageUrl: z.string().optional(),
  createdAt: z.string().optional(),
});
export type PropertyItem = z.infer<typeof PropertyItemSchema>;

export const CreatePropertyInputSchema = PropertyItemSchema.omit({ id: true, createdAt: true });
export type CreatePropertyInput = z.infer<typeof CreatePropertyInputSchema>;

export const UpdatePropertyInputSchema = CreatePropertyInputSchema.partial();
export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInputSchema>;

export const PropertyListResponse = z.object({
  properties: z.array(PropertyItemSchema),
});
export type PropertyListResponse = z.infer<typeof PropertyListResponse>;

export const PropertyResponse = z.object({
  property: PropertyItemSchema,
});
export type PropertyResponse = z.infer<typeof PropertyResponse>;

export const DeletePropertyResponse = z.object({
  success: z.boolean(),
  id: z.string(),
});
export type DeletePropertyResponse = z.infer<typeof DeletePropertyResponse>;
