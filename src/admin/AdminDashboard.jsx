import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useOrders } from '../hooks/useOrders';

export function AdminDashboard() {
  const { getOrdersByDate, getRevenueByDate, isReady } = useOrders();
  const today = format(new Date(), 'yyyy-MM-dd');
  const displayDate = format(new Date(), 'EEEE, MMMM d yyyy');

  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Manually trigger re-fetch via tick
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    Promise.all([getOrdersByDate(today), getRevenueByDate(today)]).then(
      ([todayOrders, todayRevenue]) => {
        if (cancelled) return;
        setOrders([...todayOrders].reverse());
        setRevenue(todayRevenue);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [isReady, getOrdersByDate, getRevenueByDate, today, tick]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-widest text-plum/50 mb-2">
          {displayDate}
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-plum">
          Today&apos;s Overview
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-plum p-8 flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-widest text-pearl/50">
            Revenue Today
          </span>
          <span className="font-display text-5xl text-gold font-bold">
            ₹{revenue.toLocaleString()}
          </span>
          <span className="font-sans text-xs text-pearl/30 mt-2">
            Resets at midnight ↻
          </span>
        </div>

        <div className="bg-mist border border-border/50 p-8 flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-widest text-plum/50">
            Orders Today
          </span>
          <span className="font-display text-5xl text-plum font-bold">
            {orders.length}
          </span>
          <span className="font-sans text-xs text-plum/40 mt-2">
            All orders preserved in history
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-plum/60">
            Today&apos;s Orders
          </h2>
          <button
            onClick={refresh}
            className="font-sans text-xs text-gold hover:text-gold/70 transition-colors uppercase tracking-widest"
          >
            ↻ Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center font-sans text-sm text-plum/40">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-plum/20">
            <p className="font-display text-2xl text-plum/30 mb-2">No orders yet</p>
            <p className="font-sans text-xs text-plum/30">
              Orders will appear here as they come in
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-mist">
                  {['Time', 'Customer', 'Phone', 'Cake', 'Qty', 'Total'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 font-medium text-xs uppercase tracking-widest text-plum/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-mist/50 hover:bg-mist/30 transition-colors"
                  >
                    <td className="py-4 px-3 text-plum/60 whitespace-nowrap">
                      {new Date(order.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-3 text-plum font-medium">{order.customerName}</td>
                    <td className="py-4 px-3 text-plum/70">{order.phone}</td>
                    <td className="py-4 px-3 text-plum">{order.cakeName}</td>
                    <td className="py-4 px-3 text-plum text-center">{order.quantity}</td>
                    <td className="py-4 px-3 text-plum font-semibold">
                      ₹{((order.priceAtOrder || 0) * order.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
