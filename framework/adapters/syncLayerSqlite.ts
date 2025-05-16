import { syncLayer } from '../core/syncLayer';
import { Database } from 'bun:sqlite';

export function syncLayerSqlite(options: any) {
  // Use a single DB instance for all sync layers, or allow user to pass their own
  const db = options.db || new Database('syncdata.db');
  db.exec('CREATE TABLE IF NOT EXISTS sync (id TEXT PRIMARY KEY, data TEXT)');

  return syncLayer({
    ...options,
    persist: (key: string, state: any) => {
      db.query(
        'INSERT OR REPLACE INTO sync (id, data) VALUES (?, ?)'
      ).run(key, JSON.stringify(state));
    },
    load: (key: string) => {
      const row = db.query('SELECT data FROM sync WHERE id = ?').get(key);
      return row ? JSON.parse(row.data) : options.initial();
    },
  });
} 