import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { calculatePropertyReturns } from '@wealth-advisor/rules';

describe('property-yield.rule', () => {
  it('calculates gross and net yields with CBUAE underwritten rent', () => {
    const returns = calculatePropertyReturns({
      purchasePriceAed: 1_000_000,
      expectedAnnualRentAed: 84_000, // 7,000 / mo
      annualServiceChargeAed: 12_000,
      annualMaintenanceReserveAed: 4_200,
      annualManagementFeeAed: 4_200,
      totalAcquisitionCostAed: 1_070_000,
      actualCashInvestedAed: 1_070_000,
    });

    assert.equal(returns.grossRentalYieldPct, 8.4);
    // CBUAE 2-month void underwriting deduction: 84,000 * 10 / 12 = 70,000 AED
    assert.equal(returns.cbuaeUnderwrittenRentAed, 70_000);
    assert.equal(returns.annualOperatingExpensesAed, 20_400);
    assert.equal(returns.netOperatingIncomeAed, 84_000 - 20_400);
    assert.equal(returns.netRentalYieldPct, 5.94);
  });

  it('factors in mortgage payments for cash-on-cash return', () => {
    const returns = calculatePropertyReturns({
      purchasePriceAed: 2_000_000,
      expectedAnnualRentAed: 160_000,
      annualServiceChargeAed: 20_000,
      annualMaintenanceReserveAed: 8_000,
      actualCashInvestedAed: 500_000,
      annualMortgageEmiAed: 100_000,
    });

    assert.equal(returns.netAnnualCashflowAed, 32_000);
    assert.equal(returns.cashOnCashReturnPct, 6.4);
  });
});
