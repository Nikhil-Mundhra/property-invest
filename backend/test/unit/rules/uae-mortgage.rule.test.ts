import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  calculateMaxLtv,
  calculateMonthlyEmi,
  checkDbrCompliance,
} from '@wealth-advisor/rules';

describe('uae-mortgage.rule', () => {
  it('applies Central Bank LTV rules for UAE residents', () => {
    // First home <= 5M -> 80% LTV
    const firstHomeBelow5M = calculateMaxLtv({
      propertyPriceAed: 3_000_000,
      residencyStatus: 'uae_resident',
      isFirstProperty: true,
    });
    assert.equal(firstHomeBelow5M.maxLtvPct, 80);
    assert.equal(firstHomeBelow5M.minDownPaymentPct, 20);

    // First home > 5M -> 70% LTV
    const luxuryFirstHome = calculateMaxLtv({
      propertyPriceAed: 7_000_000,
      residencyStatus: 'uae_resident',
      isFirstProperty: true,
    });
    assert.equal(luxuryFirstHome.maxLtvPct, 70);
    assert.equal(luxuryFirstHome.minDownPaymentPct, 30);

    // Second home / investment property -> 60% LTV
    const secondHome = calculateMaxLtv({
      propertyPriceAed: 2_000_000,
      residencyStatus: 'uae_resident',
      isFirstProperty: false,
    });
    assert.equal(secondHome.maxLtvPct, 60);
  });

  it('caps off-plan mortgages at 50% flat LTV under CBUAE Circular No. 31/2013, Art. 3', () => {
    const offPlanExpat = calculateMaxLtv({
      propertyPriceAed: 3_500_000,
      residencyStatus: 'uae_resident',
      isFirstProperty: true,
      isOffPlan: true,
    });
    assert.equal(offPlanExpat.maxLtvPct, 50);
    assert.equal(offPlanExpat.minDownPaymentPct, 50);

    const offPlanNational = calculateMaxLtv({
      propertyPriceAed: 4_000_000,
      residencyStatus: 'uae_national',
      isFirstProperty: true,
      isOffPlan: true,
    });
    assert.equal(offPlanNational.maxLtvPct, 50);
  });

  it('applies 60% standard banking ceiling for non-resident expatriates', () => {
    const nonResident = calculateMaxLtv({
      propertyPriceAed: 2_500_000,
      residencyStatus: 'non_resident',
    });
    assert.equal(nonResident.maxLtvPct, 60);
    assert.equal(nonResident.minDownPaymentPct, 40);
  });

  it('calculates monthly mortgage EMI using standard amortization', () => {
    const emi = calculateMonthlyEmi({
      principalAed: 1_000_000,
      annualInterestRatePct: 4.5,
      tenureYears: 25,
    });
    assert.ok(emi > 5500 && emi < 5600);
  });

  it('evaluates UAE Central Bank 50% DBR compliance including credit card limits', () => {
    // 30,000 income, 10,000 EMI, 2,000 loan, 20,000 card limit (5% = 1,000 commitment) -> Total debt = 13,000
    // DBR = 13,000 / 30,000 = 43.3% -> Compliant
    const compliant = checkDbrCompliance({
      monthlyIncomeAed: 30_000,
      monthlyEmiAed: 10_000,
      otherMonthlyDebtAed: 2_000,
      creditCardLimitsTotalAed: 20_000,
    });
    assert.equal(compliant.creditCardCommitmentAed, 1_000);
    assert.equal(compliant.dbrPct, 43.3);
    assert.equal(compliant.isCompliant, true);
  });
});
