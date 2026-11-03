import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  calculateTotalMonthlyCostOfOwnership,
  computeLifestyleScore,
} from '@wealth-advisor/rules';

describe('personal-housing.rule', () => {
  it('calculates total monthly cost of ownership', () => {
    const cost = calculateTotalMonthlyCostOfOwnership({
      monthlyMortgageEmiAed: 12_000,
      annualServiceChargeAed: 24_000,
      estimatedMonthlyUtilitiesAed: 1_500,
      annualHomeInsuranceAed: 2_400,
    });

    assert.equal(cost.monthlyMortgageEmiAed, 12_000);
    assert.equal(cost.monthlyServiceChargeAed, 2_000);
    assert.equal(cost.monthlyUtilitiesAed, 1_500);
    assert.equal(cost.monthlyInsuranceAed, 200);
    assert.equal(cost.totalMonthlyCostOfOwnershipAed, 15_700);
    assert.equal(cost.totalAnnualCostOfOwnershipAed, 15_700 * 12);
  });

  it('computes composite lifestyle score from weights', () => {
    const score = computeLifestyleScore({
      commuteScore: 80,
      schoolScore: 90,
      greeneryAmenityScore: 70,
      layoutFamilyFitScore: 85,
    });

    assert.equal(score, 82);
  });
});
