// UAE Central Bank mortgage regulations and loan amortisation rules.
// Source of truth: CBUAE Circular No. 31/2013 (Regulations Regarding Mortgage Loans),
// amended by CBUAE Board Resolution No. 31/2/2020 and subsequent 2025/2026 notices.

export type UaeResidencyStatus = 'uae_national' | 'uae_resident' | 'non_resident';

export const CENTRAL_BANK_MAX_DBR = 0.50; // Central Bank max 50% Debt-to-Burden Ratio
export const CENTRAL_BANK_MAX_TENURE_YEARS = 25; // 25 years statutory maximum loan tenor
export const RETIREMENT_AGE_SALARIED = 65; // Amortization must complete before age 65 for salaried
export const RETIREMENT_AGE_SELF_EMPLOYED = 70; // Amortization must complete before age 70 for self-employed
export const BUY_TO_LET_RENTAL_HAIRCUT_MONTHS = 2; // CBUAE mandates deducting at least 2 months rent for void periods

export interface MaxLtvRules {
  maxLtvPct: number;
  minDownPaymentPct: number;
  statutoryBasis: string;
}

export interface CalculateMaxLtvInput {
  propertyPriceAed: number;
  residencyStatus: UaeResidencyStatus;
  isFirstProperty?: boolean;
  isOffPlan?: boolean;
}

export function calculateMaxLtv(
  propertyPriceAedOrInput: number | CalculateMaxLtvInput,
  residencyStatus?: UaeResidencyStatus,
  isFirstProperty = true
): MaxLtvRules {
  let price: number;
  let status: UaeResidencyStatus;
  let firstProp: boolean;
  let offPlan = false;

  if (typeof propertyPriceAedOrInput === 'object') {
    price = Math.max(0, propertyPriceAedOrInput.propertyPriceAed);
    status = propertyPriceAedOrInput.residencyStatus;
    firstProp = propertyPriceAedOrInput.isFirstProperty ?? true;
    offPlan = Boolean(propertyPriceAedOrInput.isOffPlan);
  } else {
    price = Math.max(0, propertyPriceAedOrInput);
    status = residencyStatus ?? 'uae_resident';
    firstProp = isFirstProperty;
  }

  // 1. Off-Plan Property Cap: Strictly 50% LTV across all buyer categories under CBUAE Circular No. 31/2013, Art. 3
  if (offPlan) {
    return {
      maxLtvPct: 50,
      minDownPaymentPct: 50,
      statutoryBasis: 'CBUAE Circular No. 31/2013, Art. 3: Off-plan mortgages capped at 50% LTV regardless of nationality or residency.',
    };
  }

  // 2. UAE Nationals (Emirati Citizens)
  if (status === 'uae_national') {
    if (firstProp) {
      const maxLtv = price <= 5_000_000 ? 0.85 : 0.75;
      return {
        maxLtvPct: Math.round(maxLtv * 100),
        minDownPaymentPct: Math.round((1 - maxLtv) * 100),
        statutoryBasis: price <= 5_000_000
          ? 'CBUAE National Tier 1: 85% max LTV for first home <= AED 5,000,000.'
          : 'CBUAE National Tier 2: 75% max LTV for first home > AED 5,000,000.',
      };
    }
    return {
      maxLtvPct: 65,
      minDownPaymentPct: 35,
      statutoryBasis: 'CBUAE National Investment/Second Home: 65% max LTV.',
    };
  }

  // 3. UAE Resident Expatriates
  if (status === 'uae_resident') {
    if (firstProp) {
      const maxLtv = price <= 5_000_000 ? 0.80 : 0.70;
      return {
        maxLtvPct: Math.round(maxLtv * 100),
        minDownPaymentPct: Math.round((1 - maxLtv) * 100),
        statutoryBasis: price <= 5_000_000
          ? 'CBUAE Expat Tier 1: 80% max LTV for first home <= AED 5,000,000.'
          : 'CBUAE Expat Tier 2: 70% max LTV for first home > AED 5,000,000.',
      };
    }
    return {
      maxLtvPct: 60,
      minDownPaymentPct: 40,
      statutoryBasis: 'CBUAE Expat Investment/Second Home: 60% max LTV (40% down payment).',
    };
  }

  // 4. Non-Resident Expatriates: 50% to 60% max LTV across standard UAE bank credit policies
  return {
    maxLtvPct: 60,
    minDownPaymentPct: 40,
    statutoryBasis: 'UAE Banking Practice: Non-resident mortgages capped at 50% to 60% LTV (40% to 50% cash down payment required).',
  };
}

export interface CalculateEmiInput {
  principalAed: number;
  annualInterestRatePct: number;
  tenureYears: number;
}

export function calculateMonthlyEmi(input: CalculateEmiInput): number {
  const principal = Math.max(0, input.principalAed);
  const annualRate = Math.max(0, input.annualInterestRatePct) / 100;
  const tenureYears = Math.min(CENTRAL_BANK_MAX_TENURE_YEARS, Math.max(1, input.tenureYears));
  const tenureMonths = Math.round(tenureYears * 12);

  if (principal === 0) return 0;
  if (annualRate === 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(emi);
}

export interface DbrCheckInput {
  monthlyIncomeAed: number;
  monthlyEmiAed: number;
  otherMonthlyDebtAed?: number;
  creditCardLimitsTotalAed?: number; // 5% of total card limits treated as debt commitment
}

export interface DbrCheckResult {
  monthlyIncomeAed: number;
  monthlyEmiAed: number;
  otherMonthlyDebtAed: number;
  creditCardCommitmentAed: number;
  totalMonthlyCommitmentAed: number;
  dbrPct: number;
  isCompliant: boolean;
  maxAffordableEmiAed: number;
}

export function checkDbrCompliance(
  monthlyIncomeAedOrInput: number | DbrCheckInput,
  monthlyEmiAed = 0,
  otherMonthlyDebtAed = 0
): DbrCheckResult {
  let income: number;
  let emi: number;
  let otherDebt: number;
  let cardLimits = 0;

  if (typeof monthlyIncomeAedOrInput === 'object') {
    income = Math.max(0, monthlyIncomeAedOrInput.monthlyIncomeAed);
    emi = Math.max(0, monthlyIncomeAedOrInput.monthlyEmiAed);
    otherDebt = Math.max(0, monthlyIncomeAedOrInput.otherMonthlyDebtAed ?? 0);
    cardLimits = Math.max(0, monthlyIncomeAedOrInput.creditCardLimitsTotalAed ?? 0);
  } else {
    income = Math.max(0, monthlyIncomeAedOrInput);
    emi = Math.max(0, monthlyEmiAed);
    otherDebt = Math.max(0, otherMonthlyDebtAed);
  }

  // CBUAE rule: 5% of total credit card limit (used or unused) is included in monthly debt commitment
  const creditCardCommitment = Math.round(cardLimits * 0.05);
  const totalDebt = emi + otherDebt + creditCardCommitment;

  const dbrPct = income > 0 ? (totalDebt / income) * 100 : 100;
  const maxAffordableEmi = Math.max(0, income * CENTRAL_BANK_MAX_DBR - otherDebt - creditCardCommitment);

  return {
    monthlyIncomeAed: income,
    monthlyEmiAed: emi,
    otherMonthlyDebtAed: otherDebt,
    creditCardCommitmentAed: creditCardCommitment,
    totalMonthlyCommitmentAed: totalDebt,
    dbrPct: Math.round(dbrPct * 10) / 10,
    isCompliant: dbrPct <= CENTRAL_BANK_MAX_DBR * 100,
    maxAffordableEmiAed: Math.round(maxAffordableEmi),
  };
}
