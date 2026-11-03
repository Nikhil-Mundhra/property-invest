// UAE and Dubai Land Department (DLD) property transaction fee rules.
// Source of truth: Dubai Real Estate Parameters Verification (DLD, RERA, CBUAE 2026 Statutory Schedules).
//
// Key 2026 statutory updates:
// 1. DLD 4% Transfer Fee: Assessed on higher of contract price or DLD valuation (shorthand admin: AED 580).
// 2. Off-Plan (Oqood): Bypasses standard resale trustee fee; replaces with AED 1,000 developer portal fee (+ AED 20 admin).
// 3. Broker Commission: 0% to buyer on direct developer off-plan; 2% + 5% VAT (2.1%) on secondary resales.
// 4. Registration Trustee Fee: AED 4,000 + 5% VAT (AED 4,200) for >= 500k; AED 2,000 + 5% VAT (AED 2,100) for < 500k.
// 5. February 2025 CBUAE Mandate: Prohibits rolling transaction closing costs into mortgage loan.
//    100% of closing fees must be settled upfront in liquid cash.
// 6. Ancillary Mortgage Fees: Includes mortgage trustee fee (AED 1,050 to AED 4,200), bank processing fee (0.5% to 1%),
//    and mandatory valuation fee (AED 2,500 to AED 3,500).

export const DLD_TRANSFER_FEE_RATE = 0.04; // 4.0% standard DLD transfer fee
export const DLD_ADMIN_SHORTHAND_AED = 580; // Standard DLD administrative charge (itemized AED 520 to 745)
export const OQOOD_DEVELOPER_PORTAL_FEE_AED = 1_000; // Off-plan developer self-registration portal fee
export const OQOOD_KNOWLEDGE_INNOVATION_FEE_AED = 20; // AED 10 Knowledge + AED 10 Innovation fee

export const BROKER_COMMISSION_RATE = 0.02; // Standard 2% agency commission on secondary resales
export const UAE_VAT_RATE = 0.05; // 5% UAE standard VAT

export const TRUSTEE_FEE_THRESHOLD_AED = 500_000;
export const TRUSTEE_FEE_READY_ABOVE_THRESHOLD_AED = 4_000; // >= 500k: AED 4,000 + VAT (AED 4,200)
export const TRUSTEE_FEE_READY_BELOW_THRESHOLD_AED = 2_000; // < 500k: AED 2,000 + VAT (AED 2,100)
export const MORTGAGE_TRUSTEE_FEE_READY_AED = 1_050; // Standard bundled mortgage partner fee for ready resale
export const MORTGAGE_TRUSTEE_FEE_OFFPLAN_AED = 5_250; // Off-plan mortgage service partner fee (AED 5,000 + VAT)

export const MORTGAGE_REGISTRATION_RATE = 0.0025; // 0.25% of mortgage loan principal
export const MORTGAGE_REGISTRATION_ADMIN_AED = 290; // AED 250 deed fee + AED 40 Knowledge/Innovation
export const BANK_PROCESSING_FEE_RATE = 0.0075; // 0.75% standard bank loan arrangement fee (0.5% to 1.0% range)
export const MANDATORY_VALUATION_FEE_AED = 3_000; // Mandatory independent valuation fee (AED 2,500 to 3,500 incl VAT)

export interface AcquisitionFeeBreakdown {
  purchasePriceAed: number;
  dldFeeAed: number;
  dldAdminFeeAed: number;
  totalDldCostAed: number;
  trusteeFeeAed: number;
  trusteeVatAed: number;
  totalTrusteeFeeAed: number;
  brokerFeeAed: number;
  brokerVatAed: number;
  totalBrokerFeeAed: number;
  mortgageRegistrationFeeAed: number;
  mortgageTrusteeFeeAed: number;
  bankProcessingFeeAed: number;
  propertyValuationFeeAed: number;
  totalMortgageFrictionAed: number;
  totalAcquisitionFeesAed: number;
  downPaymentAed: number;
  totalCashRequiredForPurchaseAed: number;
  isOffPlanDirectDeveloper: boolean;
}

export interface CalculateAcquisitionFeesInput {
  purchasePriceAed: number;
  isMortgage?: boolean;
  loanAmountAed?: number;
  downPaymentAed?: number;
  isOffPlan?: boolean;
  isDirectDeveloperPurchase?: boolean; // If true, broker fee is 0% and resale trustee is bypassed
  includeBrokerFee?: boolean;
}

export function calculateAcquisitionFees(input: CalculateAcquisitionFeesInput): AcquisitionFeeBreakdown {
  const price = Math.max(0, input.purchasePriceAed);
  const isMortgage = Boolean(input.isMortgage);
  const isOffPlan = Boolean(input.isOffPlan);
  const isDirectDev = input.isDirectDeveloperPurchase ?? isOffPlan;
  const loanAmount = isMortgage ? Math.max(0, input.loanAmountAed ?? 0) : 0;
  const downPayment = isMortgage ? Math.max(0, input.downPaymentAed ?? price - loanAmount) : price;

  // 1. DLD Fees (4% + admin / Oqood portal charge)
  const dldFee = Math.round(price * DLD_TRANSFER_FEE_RATE);
  const dldAdmin = price > 0
    ? (isDirectDev ? OQOOD_DEVELOPER_PORTAL_FEE_AED + OQOOD_KNOWLEDGE_INNOVATION_FEE_AED : DLD_ADMIN_SHORTHAND_AED)
    : 0;
  const totalDld = dldFee + dldAdmin;

  // 2. Registration Trustee Fees
  let trusteeBase = 0;
  if (!isDirectDev && price > 0) {
    trusteeBase = price >= TRUSTEE_FEE_THRESHOLD_AED
      ? TRUSTEE_FEE_READY_ABOVE_THRESHOLD_AED
      : TRUSTEE_FEE_READY_BELOW_THRESHOLD_AED;
  }
  const trusteeVat = Math.round(trusteeBase * UAE_VAT_RATE);
  const totalTrustee = trusteeBase + trusteeVat;

  // 3. Broker Fees (0% for direct developer off-plan; 2% + 5% VAT for secondary resale)
  const shouldChargeBroker = input.includeBrokerFee ?? !isDirectDev;
  const brokerBase = shouldChargeBroker ? Math.round(price * BROKER_COMMISSION_RATE) : 0;
  const brokerVat = Math.round(brokerBase * UAE_VAT_RATE);
  const totalBroker = brokerBase + brokerVat;

  // 4. Mortgage Financing Friction
  let mortgageRegFee = 0;
  let mortgageTrusteeFee = 0;
  let bankProcessingFee = 0;
  let valuationFee = 0;

  if (isMortgage && loanAmount > 0) {
    // DLD 0.25% of loan + AED 290
    mortgageRegFee = Math.round(loanAmount * MORTGAGE_REGISTRATION_RATE) + MORTGAGE_REGISTRATION_ADMIN_AED;
    // Trustee fee for mortgage registration
    mortgageTrusteeFee = isOffPlan ? MORTGAGE_TRUSTEE_FEE_OFFPLAN_AED : MORTGAGE_TRUSTEE_FEE_READY_AED;
    // Bank loan arrangement fee (0.75% + 5% VAT)
    const bankBase = Math.round(loanAmount * BANK_PROCESSING_FEE_RATE);
    bankProcessingFee = bankBase + Math.round(bankBase * UAE_VAT_RATE);
    // Mandatory CBUAE independent property valuation
    valuationFee = MANDATORY_VALUATION_FEE_AED;
  }

  const totalMortgageFriction = mortgageRegFee + mortgageTrusteeFee + bankProcessingFee + valuationFee;
  const totalAcquisitionFees = totalDld + totalTrustee + totalBroker + totalMortgageFriction;

  // CBUAE February 2025 directive: 100% of transaction fees must be paid in liquid cash alongside down payment
  const totalCashRequired = downPayment + totalAcquisitionFees;

  return {
    purchasePriceAed: price,
    dldFeeAed: dldFee,
    dldAdminFeeAed: dldAdmin,
    totalDldCostAed: totalDld,
    trusteeFeeAed: trusteeBase,
    trusteeVatAed: trusteeVat,
    totalTrusteeFeeAed: totalTrustee,
    brokerFeeAed: brokerBase,
    brokerVatAed: brokerVat,
    totalBrokerFeeAed: totalBroker,
    mortgageRegistrationFeeAed: mortgageRegFee,
    mortgageTrusteeFeeAed: mortgageTrusteeFee,
    bankProcessingFeeAed: bankProcessingFee,
    propertyValuationFeeAed: valuationFee,
    totalMortgageFrictionAed: totalMortgageFriction,
    totalAcquisitionFeesAed: totalAcquisitionFees,
    downPaymentAed: downPayment,
    totalCashRequiredForPurchaseAed: totalCashRequired,
    isOffPlanDirectDeveloper: isDirectDev,
  };
}
