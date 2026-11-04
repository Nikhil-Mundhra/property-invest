import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createPropertiesApi } from '../../../src/modules/properties/properties.api.ts';
import { MemoryPropertiesRepository } from '../../../src/modules/properties/infrastructure/db/memory/memory-properties.repository.ts';

function setup() {
  const repo = new MemoryPropertiesRepository();
  const api = createPropertiesApi({ properties: repo });
  return { api, repo };
}

describe('PropertiesApi', () => {
  const tenantId = 'test-tenant';
  const userId = 'test-user';

  it('auto-seeds benchmark Dubai properties when user has no properties', async () => {
    const { api } = setup();
    const properties = await api.listProperties(tenantId, userId);

    assert.equal(properties.length, 6);
    assert.ok(properties.some((p) => p.title.includes('Waves Grande')));
    assert.ok(properties.some((p) => p.title.includes('Park Horizon')));
    assert.ok(properties.some((p) => p.title.includes('Palm Jebel Ali')));
  });

  it('creates and returns a new property for the user scope', async () => {
    const { api } = setup();

    const created = await api.createProperty(tenantId, userId, {
      title: 'Marina Gate 2BR Penthouse',
      location: 'Dubai Marina',
      developer: 'Select Group',
      propertyType: 'penthouse',
      status: 'planned',
      intent: 'investment',
      bedrooms: 2,
      bathrooms: 3,
      sqft: 1800,
      priceAed: 4_500_000,
      financingType: 'mortgage',
      downPaymentAed: 1_800_000,
      mortgageLoanAmountAed: 2_700_000,
      mortgageInterestRatePct: 4.5,
      mortgageTenureYears: 25,
      expectedAnnualRentAed: 320_000,
      annualServiceChargePerSqft: 22,
      isOffPlan: false,
      isDirectDeveloperPurchase: false,
      notes: 'Full marina view penthouse',
    });

    assert.ok(created.id.startsWith('prop-'));
    assert.equal(created.title, 'Marina Gate 2BR Penthouse');
    assert.equal(created.priceAed, 4_500_000);

    const fetched = await api.getProperty(tenantId, userId, created.id);
    assert.equal(fetched.id, created.id);
    assert.equal(fetched.title, 'Marina Gate 2BR Penthouse');
  });

  it('updates an existing property successfully', async () => {
    const { api } = setup();
    const properties = await api.listProperties(tenantId, userId);
    const target = properties[0];

    const updated = await api.updateProperty(tenantId, userId, target.id, {
      priceAed: 2_600_000,
      expectedAnnualRentAed: 200_000,
    });

    assert.equal(updated.id, target.id);
    assert.equal(updated.priceAed, 2_600_000);
    assert.equal(updated.expectedAnnualRentAed, 200_000);

    const reRead = await api.getProperty(tenantId, userId, target.id);
    assert.equal(reRead.priceAed, 2_600_000);
  });

  it('deletes an existing property', async () => {
    const { api } = setup();
    const properties = await api.listProperties(tenantId, userId);
    const target = properties[0];

    const deleteRes = await api.deleteProperty(tenantId, userId, target.id);
    assert.deepEqual(deleteRes, { success: true, id: target.id });

    await assert.rejects(
      async () => api.getProperty(tenantId, userId, target.id),
      (err: any) => err.code === 'PR_1001',
    );
  });

  it('resets properties to benchmark portfolio', async () => {
    const { api } = setup();
    await api.createProperty(tenantId, userId, {
      title: 'Temporary Scratch Property',
      location: 'Business Bay',
      developer: 'DAMAC',
      propertyType: 'apartment',
      status: 'planned',
      intent: 'investment',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      priceAed: 1_100_000,
      financingType: 'cash',
      isOffPlan: false,
      isDirectDeveloperPurchase: false,
    });

    const reset = await api.resetProperties(tenantId, userId);
    assert.equal(reset.length, 6);
    assert.ok(!reset.some((p) => p.title === 'Temporary Scratch Property'));
  });
});
