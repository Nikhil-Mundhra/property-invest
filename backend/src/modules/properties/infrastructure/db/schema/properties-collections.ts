import type { CollectionDefinition } from '#core/db/schema/collection-definition.ts';
import { PROPERTIES_COLLECTION } from '../documents/property.document.ts';

export const propertiesCollections: readonly CollectionDefinition[] = [
  {
    name: PROPERTIES_COLLECTION,
    indexes: [
      { key: { tenantId: 1, userId: 1, id: 1 }, name: 'uk_properties_tenant_user_id', unique: true },
      { key: { tenantId: 1, userId: 1, createdAt: -1 }, name: 'idx_properties_tenant_user_created' },
    ],
  },
];
