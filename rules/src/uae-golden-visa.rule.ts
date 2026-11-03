// UAE 10-year Golden Visa eligibility rules for real estate investors.
// Source of truth: DLD Policy Circular enacted 20 February 2026 & GDRFA regulations.
//
// Key 2026 statutory updates:
// 1. Mandatory minimum paid-up equity and 50% upfront payment requirements were ELIMINATED.
// 2. Qualification turns solely on the gross purchase price or DLD-certified valuation reaching
//    AED 2,000,000 on the Title Deed or Oqood initial registration, irrespective of outstanding mortgage balance.
// 3. For mortgaged properties: 0% minimum paid-up equity required beyond bank down payment;
//    requires official Bank No Objection Certificate (NOC) and liability statement addressed to DLD & GDRFA.
// 4. Off-plan properties: qualify immediately upon Oqood registration showing certified contract value >= AED 2,000,000.
// 5. Married couples can combine properties across a joint Title Deed or two separate deeds to reach AED 2,000,000.
// 6. Multiple personal freehold properties can be aggregated to reach AED 2,000,000.

export const GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED = 2_000_000;
export const GOLDEN_VISA_VALIDITY_YEARS = 10;
export const GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED = 9_884.75;
export const GOLDEN_VISA_DEPENDENT_FEE_AED = 5_774.50;

export interface CheckGoldenVisaInput {
  propertyValueAed: number; // Gross purchase price or DLD-certified valuation
  isMortgaged?: boolean;
  isOffPlan?: boolean;
  hasSpouseCombinedProperty?: boolean;
  spousePropertyValueAed?: number;
}

export interface GoldenVisaEligibilityResult {
  isEligible: boolean;
  qualifyingPropertyValuationAed: number;
  thresholdAed: number;
  shortfallAed: number;
  validityYears: number;
  governmentApplicationFeeAed: number;
  regulatoryRequirements: string[];
  keyBenefits: string[];
}

export function checkGoldenVisaEligibility(
  input: number | CheckGoldenVisaInput
): GoldenVisaEligibilityResult {
  const params: CheckGoldenVisaInput = typeof input === 'number'
    ? { propertyValueAed: input }
    : input;

  const baseValue = Math.max(0, params.propertyValueAed);
  const combinedSpouseValue = params.hasSpouseCombinedProperty
    ? Math.max(0, params.spousePropertyValueAed ?? 0)
    : 0;
  const totalValuation = baseValue + combinedSpouseValue;

  const isEligible = totalValuation >= GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED;
  const shortfall = isEligible ? 0 : GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED - totalValuation;

  const regulatoryRequirements: string[] = [];

  if (isEligible) {
    if (params.isMortgaged) {
      regulatoryRequirements.push(
        'Bank No Objection Certificate (NOC) and liability letter addressed to DLD and GDRFA specifying loan details and no objection to Golden Visa issuance (February 2026 DLD circular: 0% minimum paid-up equity beyond standard mortgage down payment).'
      );
    }
    if (params.isOffPlan) {
      regulatoryRequirements.push(
        'DLD Oqood initial contract registration certificate showing certified contract value of AED 2,000,000 or greater from a RERA-registered developer.'
      );
    } else {
      regulatoryRequirements.push(
        'Official DLD Title Deed (Mulkiya) issued in owner name with gross valuation >= AED 2,000,000.'
      );
    }
    if (params.hasSpouseCombinedProperty) {
      regulatoryRequirements.push(
        'Attested legal marriage certificate presented to DLD / GDRFA to combine spousal real estate valuations toward the AED 2,000,000 threshold.'
      );
    }
  } else {
    regulatoryRequirements.push(
      `Property valuation of AED ${totalValuation.toLocaleString()} is below the AED 2,000,000 statutory requirement. Shortfall: AED ${shortfall.toLocaleString()}.`
    );
  }

  const keyBenefits = isEligible
    ? [
        '10-year renewable self-sponsored residency for investor and immediate family',
        'Exempt from the standard UAE 6-month stay rule (residency remains active regardless of duration spent abroad)',
        'Sponsorship of spouse and unmarried children of any age',
        'Sponsorship of parents (10-year dependent visas) and domestic helpers without quota limit',
        'Access to Esaad privilege card and institutional government discount programs',
      ]
    : [];

  return {
    isEligible,
    qualifyingPropertyValuationAed: totalValuation,
    thresholdAed: GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED,
    shortfallAed: shortfall,
    validityYears: GOLDEN_VISA_VALIDITY_YEARS,
    governmentApplicationFeeAed: isEligible ? GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED : 0,
    regulatoryRequirements,
    keyBenefits,
  };
}
