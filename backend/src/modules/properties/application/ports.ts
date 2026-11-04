import type { CreatePropertyInput, PropertyItem, UpdatePropertyInput } from '@wealth-advisor/contracts';
import type { PropertyDocument } from '../infrastructure/db/documents/property.document.ts';

export interface PropertiesRepository {
  list(tenantId: string, userId: string): Promise<PropertyDocument[]>;
  findById(tenantId: string, userId: string, id: string): Promise<PropertyDocument | null>;
  create(doc: PropertyDocument): Promise<PropertyDocument>;
  update(tenantId: string, userId: string, id: string, patch: UpdatePropertyInput): Promise<PropertyDocument | null>;
  delete(tenantId: string, userId: string, id: string): Promise<boolean>;
  resetToSeeds(tenantId: string, userId: string, seeds: readonly PropertyItem[]): Promise<PropertyDocument[]>;
}
