// Deterministic calculation of property yields, net operating income, cashflow, and cash-on-cash return.
// Incorporates CBUAE Circular No. 31/2013 underwriting guidelines (2-month vacancy haircut).

export const CBUAE_UNDERWRITING_VOID_MONTHS = 2; // Central bank standard: at least 2 months void deduction

export interface PropertyReturnMetricsInput {
  purchasePriceAed: number;
  expectedAnnualRentAed: number;
  annualServiceChargeAed: number;
  annualMaintenanceReserveAed?: number;
  annualManagementFeeAed?: number;
  totalAcquisitionCostAed?: number;
  actualCashInvestedAed?: number;
  annualMortgageEmiAed?: number;
}

export interface PropertyReturnMetricsResult {
  purchasePriceAed: number;
  expectedAnnualRentAed: number;
  grossRentalYieldPct: number;
  cbuaeUnderwrittenRentAed: number; // Stressed for 2-month void period
  annualOperatingExpensesAed: number;
  netOperatingIncomeAed: number;
  netRentalYieldPct: number;
  annualMortgageEmiAed: number;
  netAnnualCashflowAed: number;
  monthlyNetCashflowAed: number;
  cashOnCashReturnPct: number;
  capitalCostBasisAed: number;
}

export function calculatePropertyReturns(input: PropertyReturnMetricsInput): PropertyReturnMetricsResult {
  const price = Math.max(0, input.purchasePriceAed);
  const rent = Math.max(0, input.expectedAnnualRentAed);
  const serviceCharge = Math.max(0, input.annualServiceChargeAed);
  const maintenance = Math.max(0, input.annualMaintenanceReserveAed ?? Math.round(rent * 0.05));
  const management = Math.max(0, input.annualManagementFeeAed ?? 0);
  const totalCostBasis = Math.max(price, input.totalAcquisitionCostAed ?? Math.round(price * 1.07));
  const cashInvested = Math.max(1, input.actualCashInvestedAed ?? totalCostBasis);
  const emiYearly = Math.max(0, input.annualMortgageEmiAed ?? 0);

  // 1. Gross Yield = (Rent / Price) * 100
  const grossYield = price > 0 ? (rent / price) * 100 : 0;

  // 2. CBUAE Underwritten Rent: deduct 2 months void periods (calculate on 10 months)
  const cbuaeUnderwrittenRent = Math.round((rent / 12) * (12 - CBUAE_UNDERWRITING_VOID_MONTHS));

  // 3. Operating expenses & Net Operating Income
  const annualOperatingExpenses = serviceCharge + maintenance + management;
  const netOperatingIncome = rent - annualOperatingExpenses;

  // 4. Net Yield = (NOI / Total Cost Basis) * 100
  const netYield = totalCostBasis > 0 ? (netOperatingIncome / totalCostBasis) * 100 : 0;

  // 5. Net Cashflow & Cash-on-Cash Return
  const netAnnualCashflow = netOperatingIncome - emiYearly;
  const monthlyNetCashflow = Math.round(netAnnualCashflow / 12);
  const cashOnCashReturn = (netAnnualCashflow / cashInvested) * 100;

  return {
    purchasePriceAed: price,
    expectedAnnualRentAed: rent,
    grossRentalYieldPct: Math.round(grossYield * 100) / 100,
    cbuaeUnderwrittenRentAed: cbuaeUnderwrittenRent,
    annualOperatingExpensesAed: annualOperatingExpenses,
    netOperatingIncomeAed: netOperatingIncome,
    netRentalYieldPct: Math.round(netYield * 100) / 100,
    annualMortgageEmiAed: emiYearly,
    netAnnualCashflowAed: netAnnualCashflow,
    monthlyNetCashflowAed: monthlyNetCashflow,
    cashOnCashReturnPct: Math.round(cashOnCashReturn * 100) / 100,
    capitalCostBasisAed: totalCostBasis,
  };
}
