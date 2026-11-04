import type { CreatePropertyInput, PropertyItem, UpdatePropertyInput } from '@wealth-advisor/contracts';
import type { PropertiesRepository } from './application/ports.ts';
import { PropertiesErrors } from './domain/errors/properties-errors.ts';
import { DUBAI_BENCHMARK_PROPERTIES } from './infrastructure/db/seed/dubai-properties.seed.ts';
import type { PropertyDocument } from './infrastructure/db/documents/property.document.ts';

export interface PropertiesApiDeps {
  properties: PropertiesRepository;
}

function toPropertyItem(doc: PropertyDocument): PropertyItem {
  const { _id, tenantId, userId, updatedAt, ...rest } = doc;
  return rest as PropertyItem;
}

export interface PropertiesApi {
  listProperties(tenantId: string, userId: string): Promise<PropertyItem[]>;
  getProperty(tenantId: string, userId: string, id: string): Promise<PropertyItem>;
  createProperty(tenantId: string, userId: string, input: CreatePropertyInput): Promise<PropertyItem>;
  updateProperty(tenantId: string, userId: string, id: string, input: UpdatePropertyInput): Promise<PropertyItem>;
  deleteProperty(tenantId: string, userId: string, id: string): Promise<{ success: boolean; id: string }>;
  resetProperties(tenantId: string, userId: string): Promise<PropertyItem[]>;
}

export function createPropertiesApi(deps: PropertiesApiDeps): PropertiesApi {
  const { properties } = deps;

  return {
    async listProperties(tenantId: string, userId: string): Promise<PropertyItem[]> {
      const docs = await properties.list(tenantId, userId);
      if (docs.length === 0) {
        // Auto-seed benchmark Dubai properties for initial user session
        const seeded = await properties.resetToSeeds(tenantId, userId, DUBAI_BENCHMARK_PROPERTIES);
        return seeded.map(toPropertyItem);
      }
      return docs.map(toPropertyItem);
    },

    async getProperty(tenantId: string, userId: string, id: string): Promise<PropertyItem> {
      const doc = await properties.findById(tenantId, userId, id);
      if (!doc) {
        throw PropertiesErrors.propertyNotFound(id);
      }
      return toPropertyItem(doc);
    },

    async createProperty(
      tenantId: string,
      userId: string,
      input: CreatePropertyInput,
    ): Promise<PropertyItem> {
      const id = `prop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const createdAt = new Date().toISOString();
      const doc: PropertyDocument = {
        ...input,
        id,
        createdAt,
        tenantId,
        userId,
      };
      const created = await properties.create(doc);
      return toPropertyItem(created);
    },

    async updateProperty(
      tenantId: string,
      userId: string,
      id: string,
      input: UpdatePropertyInput,
    ): Promise<PropertyItem> {
      const updated = await properties.update(tenantId, userId, id, input);
      if (!updated) {
        throw PropertiesErrors.propertyNotFound(id);
      }
      return toPropertyItem(updated);
    },

    async deleteProperty(
      tenantId: string,
      userId: string,
      id: string,
    ): Promise<{ success: boolean; id: string }> {
      const deleted = await properties.delete(tenantId, userId, id);
      if (!deleted) {
        throw PropertiesErrors.propertyNotFound(id);
      }
      return { success: true, id };
    },

    async resetProperties(tenantId: string, userId: string): Promise<PropertyItem[]> {
      const seeded = await properties.resetToSeeds(tenantId, userId, DUBAI_BENCHMARK_PROPERTIES);
      return seeded.map(toPropertyItem);
    },
  };
}
