import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Package, History } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CustomerSidebar from '@/components/layout/CustomerSidebar';
import ActiveOrderCard from '@/components/order/ActiveOrderCard';
import OrderCard from '@/components/order/OrderCard';
import api from '@/api/axios';

const ACTIVE_STATUSES = new Set(['PENDING', 'IN_PROGRESS', 'SHIPPED']);

export default function OrderHistoryPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('active');

  useEffect(() => {
    api.get('/orders/my')
      .then((r) => setOrders(r.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders  = useMemo(() => orders.filter((o) => ACTIVE_STATUSES.has(o.status)), [orders]);
  const historyOrders = useMemo(() => orders.filter((o) => !ACTIVE_STATUSES.has(o.status)), [orders]);

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <CustomerSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-stroke">
            <TabButton
              active={tab === 'active'}
              onClick={() => setTab('active')}
              label="Active Orders"
              count={!loading ? activeOrders.length : null}
            />
            <TabButton
              active={tab === 'history'}
              onClick={() => setTab('history')}
              label="History"
              count={!loading ? historyOrders.length : null}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : tab === 'active' ? (
            activeOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No active orders"
                message="You have no orders currently being processed."
                cta
              />
            ) : (
              <div className="flex flex-col gap-4">
                {activeOrders.map((order) => (
                  <ActiveOrderCard key={order.id} order={order} />
                ))}
              </div>
            )
          ) : (
            historyOrders.length === 0 ? (
              <EmptyState
                icon={History}
                title="No order history"
                message="Completed and cancelled orders will appear here."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {historyOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )
          )}

        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        active
          ? 'border-crimson text-crimson'
          : 'border-transparent text-muted-foreground hover:text-brown'
      }`}
    >
      {label}
      {count !== null && count > 0 && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
          active ? 'bg-crimson text-white' : 'bg-muted text-muted-foreground'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({ icon: Icon, title, message, cta }) {
  return (
    <div className="flex flex-col items-center py-20 text-center gap-4">
      <Icon size={48} className="text-muted-foreground/25" strokeWidth={1.2} />
      <p className="font-heading text-xl text-brown">{title}</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      {cta && (
        <Link
          to="/"
          className="mt-1 h-10 px-6 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center hover:bg-crimson/90 transition-colors"
        >
          Browse Cakes
        </Link>
      )}
    </div>
  );
}
