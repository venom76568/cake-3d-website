import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useOrders } from '../hooks/useOrders';

export function AdminOrderHistory() {
  const { getAllDates, getOrdersByDate, getRevenueByDate, isReady } = useOrders();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load available dates on mount
  useEffect(() => {
    if (!isReady) return;
    getAllDates().then((dates) => {
      setAvailableDates(dates);
    });
  }, [isReady, getAllDates]);

  // Load orders for selected date — all setStates inside .then() (async)
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    Promise.all([
      getOrdersByDate(selectedDate),
      getRevenueByDate(selectedDate),
    ]).then(([dayOrders, dayRevenue]) => {
      if (cancelled) return;
      setOrders([...dayOrders].reverse());
      setRevenue(dayRevenue);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isReady, selectedDate, getOrdersByDate, getRevenueByDate]);

  const formatDisplay = (dateStr) => {
    try {
      return format(new Date(dateStr + 'T00:00:00'), 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-plum">Order History</h1>
        <p className="font-sans text-sm text-plum/50 mt-2">
          Browse revenue and orders for any past date.
        </p>
      </div>

      {/* Date Selector */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {availableDates.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
              Jump to date with orders
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
            >
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {formatDisplay(d)} {d === today ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-plum p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-pearl/50 mb-2">
            Revenue — {formatDisplay(selectedDate)}
          </p>
          <p className="font-display text-4xl text-gold font-bold">₹{revenue.toLocaleString()}</p>
        </div>
        <div className="bg-mist border border-border/30 p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-plum/50 mb-2">
            Total Orders
          </p>
          <p className="font-display text-4xl text-plum font-bold">{orders.length}</p>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="py-16 text-center font-sans text-sm text-plum/40">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-plum/20">
          <p className="font-display text-2xl text-plum/30 mb-2">No orders on this date</p>
          <p className="font-sans text-xs text-plum/30">Try selecting a different date</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-mist">
                {['Time', 'Customer', 'Phone', 'Cake', 'Qty', 'Notes', 'Total'].map((h) => (
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
                <tr key={order.id} className="border-b border-mist/50 hover:bg-mist/30 transition-colors">
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
                  <td className="py-4 px-3 text-plum/60 max-w-[160px] truncate">
                    {order.notes || '—'}
                  </td>
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
  );
}
