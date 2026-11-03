import { beforeEach, describe, expect, it } from 'vitest';
import {
  addProperty,
  calculatePortfolioSummary,
  deleteProperty,
  getPropertiesSnapshot,
  resetToSeedProperties,
} from './properties-store.ts';

describe('properties-store', () => {
  beforeEach(() => {
    resetToSeedProperties();
  });

  it('loads seeded properties with owned and planned sections', () => {
    const properties = getPropertiesSnapshot();
    expect(properties.length).toBeGreaterThan(0);

    const owned = properties.filter((p) => p.status === 'owned');
    const planned = properties.filter((p) => p.status === 'planned');

    expect(owned.length).toBe(3);
    expect(planned.length).toBe(3);
  });

  it('calculates portfolio summary metrics accurately', () => {
    const properties = getPropertiesSnapshot();
    const summary = calculatePortfolioSummary(properties);

    expect(summary.totalPropertiesCount).toBe(6);
    expect(summary.ownedPropertiesCount).toBe(3);
    expect(summary.plannedPropertiesCount).toBe(3);

    // Owned properties sum: 2.45M + 1.42M + 0.78M = 4.65M AED
    expect(summary.totalPortfolioValueAed).toBe(4_650_000);
    expect(summary.goldenVisaEligible).toBe(true);
    expect(summary.weightedGrossYieldPct).toBeGreaterThan(5.0);
    expect(summary.totalMonthlyNetCashflowAed).toBeDefined();
  });

  it('allows adding a new property to the portfolio', () => {
    const initialCount = getPropertiesSnapshot().length;

    const created = addProperty({
      title: 'Downtown Opera Grand 2BR',
      location: 'Downtown Dubai',
      developer: 'Emaar Properties',
      propertyType: 'apartment',
      status: 'planned',
      intent: 'investment',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1350,
      priceAed: 3_200_000,
      financingType: 'cash',
      expectedAnnualRentAed: 240_000,
      annualServiceChargePerSqft: 25,
      isOffPlan: false,
      isDirectDeveloperPurchase: false,
    });

    const updated = getPropertiesSnapshot();
    expect(updated.length).toBe(initialCount + 1);
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Downtown Opera Grand 2BR');

    // Clean up
    deleteProperty(created.id);
    expect(getPropertiesSnapshot().length).toBe(initialCount);
  });
});
