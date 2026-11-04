import type { MiddlewareHandler } from 'hono';
import { ERROR_CODE_PREFIXES } from '@wealth-advisor/rules';
import { env } from '#core/config/env.ts';
import { resolveDataStore } from '#core/db/connection/data-store.ts';
import { defineModule, type ModuleManifest } from '#core/module/define-module.ts';
import type { ModuleContext } from '#core/module/module-context.ts';
import { createPropertiesApi, type PropertiesApi } from './properties.api.ts';
import {
  type PropertyDocument,
  PROPERTIES_COLLECTION,
} from './infrastructure/db/documents/property.document.ts';
import { MemoryPropertiesRepository } from './infrastructure/db/memory/memory-properties.repository.ts';
import { MongoPropertiesRepository } from './infrastructure/db/repositories/mongo-properties.repository.ts';
import { propertiesCollections } from './infrastructure/db/schema/properties-collections.ts';
import { PROPERTIES_ERROR_STATUSES } from './presentation/properties-error-statuses.ts';
import { propertiesRoutes } from './presentation/routes/properties.routes.ts';

export interface PropertiesModuleDeps {
  auth: MiddlewareHandler;
}

export function createPropertiesModule(
  context: ModuleContext,
  deps: PropertiesModuleDeps,
): { manifest: ModuleManifest; api: PropertiesApi } {
  const { db } = context;
  const store = resolveDataStore(env());

  const properties =
    store === 'memory'
      ? new MemoryPropertiesRepository()
      : new MongoPropertiesRepository(async () => (await db()).collection<PropertyDocument>(PROPERTIES_COLLECTION));

  const api = createPropertiesApi({ properties });

  const manifest = defineModule({
    name: 'properties',
    basePath: '/properties',
    collections: propertiesCollections,
    errors: { prefix: ERROR_CODE_PREFIXES.properties, statuses: PROPERTIES_ERROR_STATUSES },
    routes: propertiesRoutes(api, deps.auth),
  });

  return { manifest, api };
}
