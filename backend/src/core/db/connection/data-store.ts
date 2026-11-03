import type { Env } from '#core/config/env.ts';

export type DataStore = 'postgres' | 'mongo' | 'memory';

// Explicit DATA_STORE wins; otherwise postgres when a PostgreSQL URL is set,
// mongo when a MONGODB_URI is set, or memory for local dev runs without a database.
// Production never uses memory: serverless instances do not share it, so data would vanish between requests.
export function resolveDataStore(config: Env): DataStore {
  if (config.DATA_STORE === 'memory' && config.NODE_ENV === 'production') {
    throw new Error('DATA_STORE=memory is not allowed in production');
  }
  if (config.DATA_STORE) return config.DATA_STORE;
  if (config.DATABASE_URL || config.POSTGRES_URL) return 'postgres';
  if (config.MONGODB_URI) return 'mongo';
  return config.NODE_ENV === 'production' ? (config.DATABASE_URL ? 'postgres' : 'mongo') : 'memory';
}
