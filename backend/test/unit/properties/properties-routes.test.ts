import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { Hono, type MiddlewareHandler } from 'hono';
import { ERROR_CODE_PREFIXES } from '@wealth-advisor/rules';
import { ErrorCatalog } from '#core/errors/error-catalog.ts';
import { createErrorHandler } from '#core/http/error-handler.ts';
import { mountRoutes } from '#core/http/route-builder.ts';
import { PROPERTIES_ERROR_STATUSES } from '../../../src/modules/properties/presentation/properties-error-statuses.ts';
import { propertiesRoutes } from '../../../src/modules/properties/presentation/routes/properties.routes.ts';
import { createPropertiesApi } from '../../../src/modules/properties/properties.api.ts';
import { MemoryPropertiesRepository } from '../../../src/modules/properties/infrastructure/db/memory/memory-properties.repository.ts';

const CALLER = { tenantId: '6000000000000000000000bb', userId: '6000000000000000000000aa', roles: ['USER'] };

function buildApp() {
  const repo = new MemoryPropertiesRepository();
  const api = createPropertiesApi({ properties: repo });

  const auth: MiddlewareHandler = async (c, next) => {
    c.set('principal', CALLER);
    await next();
  };

  const app = new Hono();
  app.onError(createErrorHandler(new ErrorCatalog().register(ERROR_CODE_PREFIXES.properties, PROPERTIES_ERROR_STATUSES)));
  mountRoutes(app, propertiesRoutes(api, auth));
  return { app, api, repo };
}

describe('Properties Routes', () => {
  it('GET / returns properties list and auto-seeds', async () => {
    const { app } = buildApp();
    const res = await app.request('/');
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.properties));
    assert.equal(data.properties.length, 6);
  });

  it('POST / creates a valid real estate property', async () => {
    const { app } = buildApp();
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Creek Views 1BR',
        location: 'Dubai Healthcare City',
        developer: 'Azizi Developments',
        propertyType: 'apartment',
        status: 'owned',
        intent: 'investment',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 580,
        priceAed: 850_000,
        financingType: 'cash',
        expectedAnnualRentAed: 70_000,
        annualServiceChargePerSqft: 15,
        isOffPlan: false,
        isDirectDeveloperPurchase: false,
      }),
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.ok(data.property);
    assert.equal(data.property.title, 'Creek Views 1BR');
    assert.equal(data.property.priceAed, 850_000);
  });

  it('GET /:id returns a property and handles not found with 404', async () => {
    const { app } = buildApp();
    const listRes = await app.request('/');
    const listData = await listRes.json();
    const firstId = listData.properties[0].id;

    const res = await app.request(`/${firstId}`);
    assert.equal(res.status, 200);
    const itemData = await res.json();
    assert.equal(itemData.property.id, firstId);

    const notFoundRes = await app.request('/prop-non-existent-999');
    assert.equal(notFoundRes.status, 404);
  });

  it('DELETE /:id deletes a property', async () => {
    const { app } = buildApp();
    const listRes = await app.request('/');
    const listData = await listRes.json();
    const targetId = listData.properties[0].id;

    const delRes = await app.request(`/${targetId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    const getRes = await app.request(`/${targetId}`);
    assert.equal(getRes.status, 404);
  });

  it('POST /reset restores 6 benchmark properties', async () => {
    const { app } = buildApp();
    const resetRes = await app.request('/reset', { method: 'POST' });
    assert.equal(resetRes.status, 200);

    const data = await resetRes.json();
    assert.equal(data.properties.length, 6);
  });
});
