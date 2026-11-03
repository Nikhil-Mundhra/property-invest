import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  calculateAcquisitionFees,
  DLD_ADMIN_SHORTHAND_AED,
  OQOOD_DEVELOPER_PORTAL_FEE_AED,
  TRUSTEE_FEE_READY_ABOVE_THRESHOLD_AED,
  TRUSTEE_FEE_READY_BELOW_THRESHOLD_AED,
} from '@wealth-advisor/rules';

describe('uae-property-fees.rule', () => {
  it('computes ready resale acquisition fees accurately for properties >= 500k', () => {
    const price = 2_000_000;
    const fees = calculateAcquisitionFees({ purchasePriceAed: price });

    assert.equal(fees.purchasePriceAed, price);
    assert.equal(fees.dldFeeAed, 80_000);
    assert.equal(fees.dldAdminFeeAed, DLD_ADMIN_SHORTHAND_AED);
    assert.equal(fees.totalDldCostAed, 80_580);
    assert.equal(fees.trusteeFeeAed, TRUSTEE_FEE_READY_ABOVE_THRESHOLD_AED);
    assert.equal(fees.trusteeVatAed, 200);
    assert.equal(fees.totalTrusteeFeeAed, 4_200);
    assert.equal(fees.brokerFeeAed, 40_000);
    assert.equal(fees.brokerVatAed, 2_000);
    assert.equal(fees.totalBrokerFeeAed, 42_000);
    assert.equal(fees.mortgageRegistrationFeeAed, 0);
    assert.equal(fees.totalAcquisitionFeesAed, 126_780);
    assert.equal(fees.totalCashRequiredForPurchaseAed, 2_000_000 + 126_780);
  });

  it('computes sub-threshold trustee fees for ready properties < 500k', () => {
    const price = 400_000;
    const fees = calculateAcquisitionFees({ purchasePriceAed: price, isOffPlan: false, isDirectDeveloperPurchase: false });
    assert.equal(fees.trusteeFeeAed, TRUSTEE_FEE_READY_BELOW_THRESHOLD_AED);
    assert.equal(fees.trusteeVatAed, 100);
    assert.equal(fees.totalTrusteeFeeAed, 2_100);
  });

  it('zeros out buyer broker commission and resale trustee fee for direct developer off-plan sales', () => {
    const price = 2_500_000;
    const fees = calculateAcquisitionFees({
      purchasePriceAed: price,
      isOffPlan: true,
      isDirectDeveloperPurchase: true,
    });

    // 0% broker commission to buyer
    assert.equal(fees.totalBrokerFeeAed, 0);
    // Bypasses resale trustee, uses Oqood developer portal fee (AED 1,000 + 20)
    assert.equal(fees.totalTrusteeFeeAed, 0);
    assert.equal(fees.dldAdminFeeAed, OQOOD_DEVELOPER_PORTAL_FEE_AED + 20);
    assert.equal(fees.totalDldCostAed, 100_000 + 1_020);
  });

  it('computes mortgage registration and financing friction fees', () => {
    const price = 2_000_000;
    const loanAmount = 1_200_000; // 60% LTV
    const downPayment = 800_000;
    const fees = calculateAcquisitionFees({
      purchasePriceAed: price,
      isMortgage: true,
      loanAmountAed: loanAmount,
      downPaymentAed: downPayment,
      isOffPlan: false,
    });

    // DLD Mortgage reg: 0.25% of 1,200,000 = 3,000 + 290 admin = 3,290
    assert.equal(fees.mortgageRegistrationFeeAed, 3_290);
    // Mortgage trustee fee for ready resale: 1,050
    assert.equal(fees.mortgageTrusteeFeeAed, 1_050);
    // Bank processing fee: 0.75% of 1.2M = 9,000 + 5% VAT (450) = 9,450
    assert.equal(fees.bankProcessingFeeAed, 9_450);
    // Mandatory CBUAE valuation fee: 3,000
    assert.equal(fees.propertyValuationFeeAed, 3_000);
    // Total cash required includes down payment + all closing fees (February 2025 CBUAE mandate)
    assert.equal(fees.totalCashRequiredForPurchaseAed, downPayment + fees.totalAcquisitionFeesAed);
  });
});
