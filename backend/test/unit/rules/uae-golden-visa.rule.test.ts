import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  checkGoldenVisaEligibility,
  GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED,
  GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED,
} from '@wealth-advisor/rules';

describe('uae-golden-visa.rule', () => {
  it('qualifies mortgaged properties under the 20 February 2026 DLD circular with 0% minimum paid-up equity requirement', () => {
    // AED 2,000,000 gross property value with an 80% mortgage (only 400k down payment paid)
    const result = checkGoldenVisaEligibility({
      propertyValueAed: 2_000_000,
      isMortgaged: true,
      isOffPlan: false,
    });
    assert.equal(result.isEligible, true);
    assert.equal(result.shortfallAed, 0);
    assert.equal(result.validityYears, 10);
    assert.equal(result.governmentApplicationFeeAed, GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED);
    // Requires Bank NOC confirming 0% min paid-up equity beyond standard down payment
    assert.ok(result.regulatoryRequirements.some((req) => req.includes('Bank No Objection Certificate (NOC)')));
  });

  it('qualifies off-plan properties immediately upon Oqood registration >= AED 2M', () => {
    const result = checkGoldenVisaEligibility({
      propertyValueAed: 2_800_000,
      isOffPlan: true,
    });
    assert.equal(result.isEligible, true);
    assert.ok(result.regulatoryRequirements.some((req) => req.includes('Oqood initial contract registration certificate')));
  });

  it('allows married couples to combine properties to reach AED 2,000,000 threshold', () => {
    // 1,200,000 + 900,000 spouse property = 2,100,000
    const result = checkGoldenVisaEligibility({
      propertyValueAed: 1_200_000,
      hasSpouseCombinedProperty: true,
      spousePropertyValueAed: 900_000,
    });
    assert.equal(result.isEligible, true);
    assert.equal(result.qualifyingPropertyValuationAed, 2_100_000);
  });

  it('identifies shortfall for properties below AED 2,000,000', () => {
    const result = checkGoldenVisaEligibility(1_400_000);
    assert.equal(result.isEligible, false);
    assert.equal(result.shortfallAed, 600_000);
    assert.equal(result.thresholdAed, GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED);
  });
});
