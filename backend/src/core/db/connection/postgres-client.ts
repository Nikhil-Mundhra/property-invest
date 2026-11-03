import pg from 'pg';
import { env } from '#core/config/env.ts';
import { AppError } from '#core/errors/app-error.ts';
import { CORE_ERROR_CODES } from '@wealth-advisor/rules';

const { Pool } = pg;

export interface PostgresDocRow {
  collection_name: string;
  id: string;
  data: any;
  created_at: Date;
  updated_at: Date;
}

let poolInstance: pg.Pool | undefined;
let tableInitialized = false;

export function getPostgresPool(): pg.Pool {
  if (!poolInstance) {
    const connectionString = env().DATABASE_URL ?? env().POSTGRES_URL;
    if (!connectionString) {
      throw new AppError(503, CORE_ERROR_CODES.databaseUnconfigured, 'PostgreSQL database is not configured');
    }

    const isSslDisabled = connectionString.includes('sslmode=disable') || connectionString.includes('localhost');

    poolInstance = new Pool({
      connectionString,
      ssl: isSslDisabled ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    poolInstance.on('error', (err) => {
      console.error('[postgres] unexpected pool error:', err);
    });
  }

  return poolInstance;
}

export async function ensurePostgresSchema(pool: pg.Pool): Promise<void> {
  if (tableInitialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS syntropy_documents (
      collection_name VARCHAR(128) NOT NULL,
      id VARCHAR(256) NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (collection_name, id)
    );
    CREATE INDEX IF NOT EXISTS idx_syntropy_coll ON syntropy_documents(collection_name);
    CREATE INDEX IF NOT EXISTS idx_syntropy_coll_id ON syntropy_documents(collection_name, id);
  `);

  tableInitialized = true;
}

function extractId(doc: any): string {
  if (!doc) return crypto.randomUUID();
  if (doc._id) return typeof doc._id === 'object' && 'toString' in doc._id ? doc._id.toString() : String(doc._id);
  if (doc.id) return String(doc.id);
  return crypto.randomUUID();
}

function matchesFilter(doc: any, filter: Record<string, any>): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, value] of Object.entries(filter)) {
    if (key === '_id' || key === 'id') {
      const targetId = typeof value === 'object' && value && 'toString' in value ? value.toString() : String(value);
      const docId = doc._id ? (typeof doc._id === 'object' && 'toString' in doc._id ? doc._id.toString() : String(doc._id)) : String(doc.id ?? '');
      if (docId !== targetId) return false;
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      if ('$gte' in value || '$lte' in value || '$gt' in value || '$lt' in value) {
        const docVal = doc[key];
        if (value.$gte !== undefined && !(docVal >= value.$gte)) return false;
        if (value.$lte !== undefined && !(docVal <= value.$lte)) return false;
        if (value.$gt !== undefined && !(docVal > value.$gt)) return false;
        if (value.$lt !== undefined && !(docVal < value.$lt)) return false;
        continue;
      }
      if ('$ne' in value) {
        if (doc[key] === value.$ne) return false;
        continue;
      }
      if ('$in' in value && Array.isArray(value.$in)) {
        if (!value.$in.includes(doc[key])) return false;
        continue;
      }
    }

    const filterValStr = typeof value === 'object' && value && 'toString' in value ? value.toString() : value;
    const docValStr = typeof doc[key] === 'object' && doc[key] && 'toString' in doc[key] ? doc[key].toString() : doc[key];

    if (docValStr !== filterValStr) {
      return false;
    }
  }

  return true;
}

export class PostgresCollection<T = any> {
  private readonly pool: pg.Pool;
  private readonly collectionName: string;

  constructor(pool: pg.Pool, collectionName: string) {
    this.pool = pool;
    this.collectionName = collectionName;
  }

  private async init() {
    await ensurePostgresSchema(this.pool);
  }

  async insertOne(doc: T): Promise<{ insertedId: string; acknowledged: boolean }> {
    await this.init();
    const id = extractId(doc);
    const serialized = JSON.stringify(doc);

    await this.pool.query(
      `INSERT INTO syntropy_documents (collection_name, id, data, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (collection_name, id) DO UPDATE SET data = $3, updated_at = NOW()`,
      [this.collectionName, id, serialized],
    );

    return { insertedId: id, acknowledged: true };
  }

  async findOne(filter: Record<string, any> = {}, options: { sort?: Record<string, number>; projection?: any } = {}): Promise<T | null> {
    await this.init();

    // Direct primary key optimization when filtering by _id or id
    const filterId = filter._id ?? filter.id;
    if (filterId && Object.keys(filter).length === 1) {
      const idStr = typeof filterId === 'object' && 'toString' in filterId ? filterId.toString() : String(filterId);
      const res = await this.pool.query(
        `SELECT data FROM syntropy_documents WHERE collection_name = $1 AND id = $2 LIMIT 1`,
        [this.collectionName, idStr],
      );
      if (res.rows.length === 0) return null;
      return res.rows[0].data as T;
    }

    const res = await this.pool.query(
      `SELECT data FROM syntropy_documents WHERE collection_name = $1`,
      [this.collectionName],
    );

    let matched: any[] = res.rows.map((r) => r.data).filter((doc) => matchesFilter(doc, filter));

    if (options.sort) {
      const sortEntries = Object.entries(options.sort);
      matched.sort((a, b) => {
        for (const [key, dir] of sortEntries) {
          if (a[key] < b[key]) return dir === 1 ? -1 : 1;
          if (a[key] > b[key]) return dir === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    return (matched[0] as T) ?? null;
  }

  find(filter: Record<string, any> = {}) {
    return {
      sort: (sortSpec: Record<string, number>) => ({
        toArray: async (): Promise<T[]> => {
          await this.init();
          const res = await this.pool.query(
            `SELECT data FROM syntropy_documents WHERE collection_name = $1`,
            [this.collectionName],
          );
          let matched = res.rows.map((r) => r.data).filter((doc) => matchesFilter(doc, filter));
          const sortEntries = Object.entries(sortSpec);
          matched.sort((a, b) => {
            for (const [key, dir] of sortEntries) {
              if (a[key] < b[key]) return dir === 1 ? -1 : 1;
              if (a[key] > b[key]) return dir === 1 ? 1 : -1;
            }
            return 0;
          });
          return matched as T[];
        },
      }),
      toArray: async (): Promise<T[]> => {
        await this.init();
        const res = await this.pool.query(
          `SELECT data FROM syntropy_documents WHERE collection_name = $1`,
          [this.collectionName],
        );
        const matched = res.rows.map((r) => r.data).filter((doc) => matchesFilter(doc, filter));
        return matched as T[];
      },
    };
  }

  async updateOne(
    filter: Record<string, any>,
    update: { $set?: Record<string, any>; [key: string]: any },
    options: { upsert?: boolean } = {},
  ): Promise<{ matchedCount: number; modifiedCount: number; upsertedId?: string }> {
    await this.init();
    const existing = await this.findOne(filter);

    if (!existing) {
      if (options.upsert) {
        const newDoc = { ...filter, ...(update.$set ?? update) };
        const res = await this.insertOne(newDoc as T);
        return { matchedCount: 0, modifiedCount: 1, upsertedId: res.insertedId };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const updatedDoc = {
      ...existing,
      ...(update.$set ?? update),
    };

    const id = extractId(existing);
    await this.pool.query(
      `UPDATE syntropy_documents SET data = $3, updated_at = NOW() WHERE collection_name = $1 AND id = $2`,
      [this.collectionName, id, JSON.stringify(updatedDoc)],
    );

    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateMany(
    filter: Record<string, any>,
    update: { $set?: Record<string, any>; [key: string]: any },
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    await this.init();
    const docs = await this.find(filter).toArray();

    for (const doc of docs) {
      const updatedDoc = {
        ...doc,
        ...(update.$set ?? update),
      };
      const id = extractId(doc);
      await this.pool.query(
        `UPDATE syntropy_documents SET data = $3, updated_at = NOW() WHERE collection_name = $1 AND id = $2`,
        [this.collectionName, id, JSON.stringify(updatedDoc)],
      );
    }

    return { matchedCount: docs.length, modifiedCount: docs.length };
  }

  async replaceOne(
    filter: Record<string, any>,
    replacement: T,
    options: { upsert?: boolean } = {},
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    await this.init();
    const existing = await this.findOne(filter);

    if (!existing) {
      if (options.upsert) {
        await this.insertOne(replacement);
        return { matchedCount: 0, modifiedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const id = extractId(existing);
    await this.pool.query(
      `UPDATE syntropy_documents SET data = $3, updated_at = NOW() WHERE collection_name = $1 AND id = $2`,
      [this.collectionName, id, JSON.stringify(replacement)],
    );

    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteOne(filter: Record<string, any>): Promise<{ deletedCount: number }> {
    await this.init();
    const existing = await this.findOne(filter);
    if (!existing) return { deletedCount: 0 };

    const id = extractId(existing);
    await this.pool.query(
      `DELETE FROM syntropy_documents WHERE collection_name = $1 AND id = $2`,
      [this.collectionName, id],
    );

    return { deletedCount: 1 };
  }

  async deleteMany(filter: Record<string, any>): Promise<{ deletedCount: number }> {
    await this.init();
    const docs = await this.find(filter).toArray();
    for (const doc of docs) {
      const id = extractId(doc);
      await this.pool.query(
        `DELETE FROM syntropy_documents WHERE collection_name = $1 AND id = $2`,
        [this.collectionName, id],
      );
    }
    return { deletedCount: docs.length };
  }

  async countDocuments(filter: Record<string, any> = {}): Promise<number> {
    await this.init();
    const docs = await this.find(filter).toArray();
    return docs.length;
  }

  async bulkWrite(operations: any[], _options?: any): Promise<{ acknowledged: boolean; insertedCount: number }> {
    await this.init();
    let count = 0;
    for (const op of operations) {
      if (op.insertOne) {
        await this.insertOne(op.insertOne.document);
        count++;
      } else if (op.updateOne) {
        await this.updateOne(op.updateOne.filter, op.updateOne.update, op.updateOne);
      } else if (op.replaceOne) {
        await this.replaceOne(op.replaceOne.filter, op.replaceOne.replacement, op.replaceOne);
      }
    }
    return { acknowledged: true, insertedCount: count };
  }

  async createIndexes(_indexes: any[]): Promise<string[]> {
    return [];
  }
}

export class PostgresDb {
  private readonly pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  collection<T = any>(name: string): PostgresCollection<T> {
    return new PostgresCollection<T>(this.pool, name);
  }

  async command(cmd: Record<string, any>): Promise<any> {
    if (cmd.ping) {
      await this.pool.query('SELECT 1;');
      return { ok: 1 };
    }
    // Safe no-op for collMod or other mongo administrative commands
    return { ok: 1 };
  }

  listCollections(_filter?: any, _options?: any) {
    return {
      hasNext: async () => false,
    };
  }

  async createCollection(name: string, _options?: any): Promise<PostgresCollection> {
    await ensurePostgresSchema(this.pool);
    return this.collection(name);
  }
}

export async function getPostgresDb(): Promise<PostgresDb> {
  const pool = getPostgresPool();
  await ensurePostgresSchema(pool);
  return new PostgresDb(pool);
}

export async function closePostgresPool(): Promise<void> {
  if (poolInstance) {
    const p = poolInstance;
    poolInstance = undefined;
    tableInitialized = false;
    await p.end();
  }
}
