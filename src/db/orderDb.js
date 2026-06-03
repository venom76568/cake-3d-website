import { openDB } from 'idb';

const DB_NAME = 'cakeshop-db';
const DB_VERSION = 1;
const ORDERS_STORE = 'orders';

/**
 * Opens (or creates) the IndexedDB database.
 * The `orders` object store uses an auto-incrementing key and is indexed
 * by `date` (YYYY-MM-DD) for fast day-based queries.
 */
export async function openOrderDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ORDERS_STORE)) {
        const store = db.createObjectStore(ORDERS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Index by date string for fast per-day queries
        store.createIndex('by_date', 'date', { unique: false });
      }
    },
  });
}

export { ORDERS_STORE };
