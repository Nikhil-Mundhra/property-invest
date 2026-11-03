// Deterministic calculation of primary residence total cost of ownership and lifestyle suitability.

export interface PersonalHousingCostInput {
  monthlyMortgageEmiAed: number;
  annualServiceChargeAed: number;
  estimatedMonthlyUtilitiesAed?: number; // DEWA, chiller, internet
  annualHomeInsuranceAed?: number;
}

export interface PersonalHousingCostResult {
  monthlyMortgageEmiAed: number;
  monthlyServiceChargeAed: number;
  monthlyUtilitiesAed: number;
  monthlyInsuranceAed: number;
  totalMonthlyCostOfOwnershipAed: number;
  totalAnnualCostOfOwnershipAed: number;
}

export function calculateTotalMonthlyCostOfOwnership(input: PersonalHousingCostInput): PersonalHousingCostResult {
  const emi = Math.max(0, input.monthlyMortgageEmiAed);
  const monthlyServiceCharge = Math.round(Math.max(0, input.annualServiceChargeAed) / 12);
  const monthlyUtilities = Math.max(0, input.estimatedMonthlyUtilitiesAed ?? 1_200); // Standard 1,200 AED average utilities in Dubai
  const monthlyInsurance = Math.round(Math.max(0, input.annualHomeInsuranceAed ?? 1_500) / 12);

  const totalMonthly = emi + monthlyServiceCharge + monthlyUtilities + monthlyInsurance;
  const totalAnnual = totalMonthly * 12;

  return {
    monthlyMortgageEmiAed: emi,
    monthlyServiceChargeAed: monthlyServiceCharge,
    monthlyUtilitiesAed: monthlyUtilities,
    monthlyInsuranceAed: monthlyInsurance,
    totalMonthlyCostOfOwnershipAed: totalMonthly,
    totalAnnualCostOfOwnershipAed: totalAnnual,
  };
}

export interface LifestyleSuitabilityWeights {
  commuteScore: number; // 0 - 100
  schoolScore: number; // 0 - 100
  greeneryAmenityScore: number; // 0 - 100
  layoutFamilyFitScore: number; // 0 - 100
}

export function computeLifestyleScore(weights: LifestyleSuitabilityWeights): number {
  const composite = (
    weights.commuteScore * 0.35 +
    weights.schoolScore * 0.25 +
    weights.greeneryAmenityScore * 0.20 +
    weights.layoutFamilyFitScore * 0.20
  );
  return Math.round(composite);
}
