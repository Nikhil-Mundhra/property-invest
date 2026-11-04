import type { Collection } from 'mongodb';
import type { PropertyItem, UpdatePropertyInput } from '@wealth-advisor/contracts';
import type { PropertiesRepository } from '../../../application/ports.ts';
import type { PropertyDocument } from '../documents/property.document.ts';

export class MongoPropertiesRepository implements PropertiesRepository {
  private readonly col: () => Promise<Collection<PropertyDocument>>;

  constructor(col: () => Promise<Collection<PropertyDocument>>) {
    this.col = col;
  }

  async list(tenantId: string, userId: string): Promise<PropertyDocument[]> {
    const docs = await (await this.col())
      .find({ tenantId, userId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs;
  }

  async findById(tenantId: string, userId: string, id: string): Promise<PropertyDocument | null> {
    return (await this.col()).findOne({ tenantId, userId, id });
  }

  async create(doc: PropertyDocument): Promise<PropertyDocument> {
    await (await this.col()).insertOne(doc as any);
    return doc;
  }

  async update(
    tenantId: string,
    userId: string,
    id: string,
    patch: UpdatePropertyInput,
  ): Promise<PropertyDocument | null> {
    const updatedAt = new Date().toISOString();
    await (await this.col()).updateOne(
      { tenantId, userId, id },
      { $set: { ...patch, updatedAt } },
    );
    return this.findById(tenantId, userId, id);
  }

  async delete(tenantId: string, userId: string, id: string): Promise<boolean> {
    const res = await (await this.col()).deleteOne({ tenantId, userId, id });
    return (res.deletedCount ?? 0) > 0;
  }

  async resetToSeeds(
    tenantId: string,
    userId: string,
    seeds: readonly PropertyItem[],
  ): Promise<PropertyDocument[]> {
    const col = await this.col();
    await col.deleteMany({ tenantId, userId });

    const created: PropertyDocument[] = [];
    for (const seed of seeds) {
      const doc: PropertyDocument = {
        ...seed,
        tenantId,
        userId,
        createdAt: seed.createdAt ?? new Date().toISOString(),
      };
      await col.insertOne(doc as any);
      created.push(doc);
    }
    return created;
  }
}
