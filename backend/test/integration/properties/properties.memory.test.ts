import { strict as assert } from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { type TestApp, startTestApp } from '../../support/test-app.ts';

const json = async (response: Response) => (await response.json()) as Record<string, unknown>;

describe('properties API integration (memory)', () => {
  let app: TestApp;

  before(async () => {
    app = await startTestApp({ store: 'memory' });
  });

  after(async () => {
    await app.stop();
  });

  it('GET /api/properties auto-seeds and lists benchmark properties for demo scope', async () => {
    const res = await app.app.request('/api/properties');
    assert.equal(res.status, 200);

    const body = await json(res);
    assert.ok(Array.isArray(body.properties));
    assert.equal(body.properties.length, 6);
  });

  it('POST /api/properties adds a new property to the portfolio', async () => {
    const res = await app.app.request('/api/properties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'One Zaabeel 2BR Luxury Tower',
        location: 'Zaabeel',
        developer: 'ITHRA Dubai',
        propertyType: 'apartment',
        status: 'owned',
        intent: 'investment',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1400,
        priceAed: 3_900_000,
        financingType: 'mortgage',
        downPaymentAed: 780_000,
        mortgageLoanAmountAed: 3_120_000,
        mortgageInterestRatePct: 4.4,
        mortgageTenureYears: 25,
        expectedAnnualRentAed: 270_000,
        annualServiceChargePerSqft: 28,
        isOffPlan: false,
        isDirectDeveloperPurchase: false,
      }),
    });

    assert.equal(res.status, 201);
    const body = (await json(res)) as { property: { id: string; title: string } };
    assert.ok(body.property.id);
    assert.equal(body.property.title, 'One Zaabeel 2BR Luxury Tower');

    // Verify GET /api/properties has 7 properties now
    const listRes = await app.app.request('/api/properties');
    const listBody = await json(listRes);
    assert.equal((listBody.properties as any[]).length, 7);
  });
});
