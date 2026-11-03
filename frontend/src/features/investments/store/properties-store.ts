import { useSyncExternalStore } from 'react';
import type {
  CreatePropertyInput,
  PropertyItem,
  RealEstatePortfolioSummary,
} from '@wealth-advisor/contracts';
import {
  calculateAcquisitionFees,
  calculateMonthlyEmi,
  calculatePropertyReturns,
  calculateTotalMonthlyCostOfOwnership,
  checkGoldenVisaEligibility,
} from '@wealth-advisor/rules';
import { SEEDED_PROPERTIES } from '../data/seed-properties.ts';

const STORAGE_KEY = 'syntropy_real_estate_properties_v1';

function loadInitialProperties(): PropertyItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback on corrupt storage
    }
  }
  return [...SEEDED_PROPERTIES];
}

let propertiesState: PropertyItem[] = loadInitialProperties();
const listeners = new Set<() => void>();

function persistAndNotify(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(propertiesState));
    } catch {
      // Storage unavailable
    }
  }
  listeners.forEach((listener) => listener());
}

export function subscribeProperties(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPropertiesSnapshot(): PropertyItem[] {
  return propertiesState;
}

export function useProperties(): PropertyItem[] {
  return useSyncExternalStore(subscribeProperties, getPropertiesSnapshot, () => SEEDED_PROPERTIES);
}

export function useProperty(id: string): PropertyItem | undefined {
  const properties = useProperties();
  return properties.find((p) => p.id === id);
}

export function addProperty(input: CreatePropertyInput): PropertyItem {
  const newProperty: PropertyItem = {
    ...input,
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  propertiesState = [newProperty, ...propertiesState];
  persistAndNotify();
  return newProperty;
}

export function deleteProperty(id: string): void {
  propertiesState = propertiesState.filter((p) => p.id !== id);
  persistAndNotify();
}

export function resetToSeedProperties(): void {
  propertiesState = [...SEEDED_PROPERTIES];
  persistAndNotify();
}

export function calculatePortfolioSummary(properties: PropertyItem[]): RealEstatePortfolioSummary {
  const owned = properties.filter((p) => p.status === 'owned');
  const planned = properties.filter((p) => p.status === 'planned');

  const totalValue = owned.reduce((sum, p) => sum + p.priceAed, 0);

  let totalEquity = 0;
  let totalMortgage = 0;
  let totalGrossRent = 0;
  let totalNetRent = 0;
  let totalAnnualCashflow = 0;
  let totalMonthlyOwnershipCost = 0;

  for (const p of owned) {
    const isMortgage = p.financingType === 'mortgage';
    const loan = isMortgage ? (p.mortgageLoanAmountAed ?? Math.round(p.priceAed * 0.8)) : 0;
    const down = isMortgage ? (p.downPaymentAed ?? (p.priceAed - loan)) : p.priceAed;
    const fees = calculateAcquisitionFees({
      purchasePriceAed: p.priceAed,
      isMortgage,
      loanAmountAed: loan,
      downPaymentAed: down,
      isOffPlan: p.isOffPlan,
      isDirectDeveloperPurchase: p.isDirectDeveloperPurchase ?? p.isOffPlan,
    });

    totalEquity += fees.totalCashRequiredForPurchaseAed;
    totalMortgage += loan;

    const rent = p.expectedAnnualRentAed ?? 0;
    totalGrossRent += rent;

    const serviceCharge = (p.annualServiceChargePerSqft ?? 15) * p.sqft;
    const emiMonthly = isMortgage
      ? calculateMonthlyEmi({
          principalAed: loan,
          annualInterestRatePct: p.mortgageInterestRatePct ?? 4.5,
          tenureYears: p.mortgageTenureYears ?? 25,
        })
      : 0;

    const returns = calculatePropertyReturns({
      purchasePriceAed: p.priceAed,
      expectedAnnualRentAed: rent,
      annualServiceChargeAed: serviceCharge,
      totalAcquisitionCostAed: p.priceAed + fees.totalAcquisitionFeesAed,
      actualCashInvestedAed: fees.totalCashRequiredForPurchaseAed,
      annualMortgageEmiAed: emiMonthly * 12,
    });

    totalNetRent += returns.netOperatingIncomeAed;
    totalAnnualCashflow += returns.netAnnualCashflowAed;

    if (p.intent === 'personal_home') {
      const ownership = calculateTotalMonthlyCostOfOwnership({
        monthlyMortgageEmiAed: emiMonthly,
        annualServiceChargeAed: serviceCharge,
      });
      totalMonthlyOwnershipCost += ownership.totalMonthlyCostOfOwnershipAed;
    }
  }

  const weightedGrossYield = totalValue > 0 ? (totalGrossRent / totalValue) * 100 : 0;
  const weightedNetYield = totalEquity > 0 ? (totalNetRent / totalEquity) * 100 : 0;
  const goldenVisaCheck = checkGoldenVisaEligibility(totalValue);

  return {
    totalPropertiesCount: properties.length,
    ownedPropertiesCount: owned.length,
    plannedPropertiesCount: planned.length,
    totalPortfolioValueAed: totalValue,
    totalEquityInvestedAed: totalEquity,
    totalMortgageBalanceAed: totalMortgage,
    weightedGrossYieldPct: Math.round(weightedGrossYield * 100) / 100,
    weightedNetYieldPct: Math.round(weightedNetYield * 100) / 100,
    totalAnnualNetCashflowAed: totalAnnualCashflow,
    totalMonthlyNetCashflowAed: Math.round(totalAnnualCashflow / 12),
    totalMonthlyOwnershipCostAed: totalMonthlyOwnershipCost,
    goldenVisaEligible: goldenVisaCheck.isEligible,
    goldenVisaShortfallAed: goldenVisaCheck.shortfallAed,
  };
}
