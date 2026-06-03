import { useState, useEffect, useCallback } from 'react';
import { openOrderDb, ORDERS_STORE } from '../db/orderDb';
import { format } from 'date-fns';

/**
 * Hook for all order CRUD operations against IndexedDB.
 * Revenue is computed at read-time — no cron or manual reset needed.
 * "Daily reset" means revenue = sum of today's orders only.
 */
export function useOrders() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    openOrderDb().then(setDb).catch((err) => {
      console.error('Failed to open order database:', err);
    });
  }, []);

  /**
   * Adds an order. Automatically stamps date and timestamp.
   */
  const addOrder = useCallback(
    async (orderData) => {
      if (!db) return null;
      const now = new Date();
      const entry = {
        ...orderData,
        timestamp: now.toISOString(),
        date: format(now, 'yyyy-MM-dd'),
      };
      const id = await db.add(ORDERS_STORE, entry);
      return { ...entry, id };
    },
    [db]
  );

  /**
   * Returns all orders for a given YYYY-MM-DD date string.
   */
  const getOrdersByDate = useCallback(
    async (dateStr) => {
      if (!db) return [];
      return db.getAllFromIndex(ORDERS_STORE, 'by_date', dateStr);
    },
    [db]
  );

  /**
   * Returns all unique date strings (sorted descending) that have orders.
   */
  const getAllDates = useCallback(async () => {
    if (!db) return [];
    const all = await db.getAll(ORDERS_STORE);
    const unique = [...new Set(all.map((o) => o.date))];
    return unique.sort((a, b) => b.localeCompare(a));
  }, [db]);

  /**
   * Computes total revenue (price × qty) for a given date.
   */
  const getRevenueByDate = useCallback(
    async (dateStr) => {
      const orders = await getOrdersByDate(dateStr);
      return orders.reduce((sum, o) => sum + (o.priceAtOrder || 0) * (o.quantity || 1), 0);
    },
    [getOrdersByDate]
  );

  return {
    isReady: !!db,
    addOrder,
    getOrdersByDate,
    getAllDates,
    getRevenueByDate,
  };
}
