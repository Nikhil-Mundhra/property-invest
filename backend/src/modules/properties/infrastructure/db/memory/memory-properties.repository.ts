import type { PropertyItem, UpdatePropertyInput } from '@wealth-advisor/contracts';
import type { PropertiesRepository } from '../../../application/ports.ts';
import type { PropertyDocument } from '../documents/property.document.ts';

export class MemoryPropertiesRepository implements PropertiesRepository {
  private readonly docs = new Map<string, PropertyDocument>();

  private key(tenantId: string, userId: string, id: string): string {
    return `${tenantId}:${userId}:${id}`;
  }

  async list(tenantId: string, userId: string): Promise<PropertyDocument[]> {
    const results: PropertyDocument[] = [];
    for (const doc of this.docs.values()) {
      if (doc.tenantId === tenantId && doc.userId === userId) {
        results.push({ ...doc });
      }
    }
    return results.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }

  async findById(tenantId: string, userId: string, id: string): Promise<PropertyDocument | null> {
    const doc = this.docs.get(this.key(tenantId, userId, id));
    return doc ? { ...doc } : null;
  }

  async create(doc: PropertyDocument): Promise<PropertyDocument> {
    const copy: PropertyDocument = { ...doc };
    this.docs.set(this.key(doc.tenantId, doc.userId, doc.id), copy);
    return copy;
  }

  async update(
    tenantId: string,
    userId: string,
    id: string,
    patch: UpdatePropertyInput,
  ): Promise<PropertyDocument | null> {
    const key = this.key(tenantId, userId, id);
    const existing = this.docs.get(key);
    if (!existing) return null;

    const updated: PropertyDocument = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.docs.set(key, updated);
    return { ...updated };
  }

  async delete(tenantId: string, userId: string, id: string): Promise<boolean> {
    return this.docs.delete(this.key(tenantId, userId, id));
  }

  async resetToSeeds(
    tenantId: string,
    userId: string,
    seeds: readonly PropertyItem[],
  ): Promise<PropertyDocument[]> {
    // Remove existing for this user
    for (const [k, doc] of this.docs.entries()) {
      if (doc.tenantId === tenantId && doc.userId === userId) {
        this.docs.delete(k);
      }
    }

    const created: PropertyDocument[] = [];
    for (const seed of seeds) {
      const doc: PropertyDocument = {
        ...seed,
        tenantId,
        userId,
        createdAt: seed.createdAt ?? new Date().toISOString(),
      };
      this.docs.set(this.key(tenantId, userId, doc.id), doc);
      created.push({ ...doc });
    }
    return created;
  }
}
