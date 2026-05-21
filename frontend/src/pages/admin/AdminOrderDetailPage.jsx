import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import StatusBadge from '@/components/order/StatusBadge';
import StatusTimeline from '@/components/order/StatusTimeline';
import { STATUS_CONFIG, ORDER_STATUSES } from '@/utils/orderStatus';
import { formatPrice, formatDateTime } from '@/utils/format';
import api from '@/api/axios';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch((err) => {
        if (err.response?.status === 404) navigate('/not-found', { replace: true });
        else setError('Failed to load order.');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleStatusChange(newStatus) {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status: newStatus });
      setOrder(data);
    } catch {
      // silent — state didn't change so select reverts
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <AdminSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brown transition-colors mb-6"
          >
            <ChevronLeft size={15} />
            Back to orders
          </button>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : error || !order ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
              <Link to="/admin/orders" className="text-sm text-crimson font-semibold hover:underline">
                ← Back to orders
              </Link>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row gap-8 items-start">

              {/* ── Main ──────────────────────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Header */}
                <div className="bg-white rounded-2xl border border-stroke px-6 py-5 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Order</p>
                    <p className="font-heading text-2xl text-brown">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Customer</p>
                    <p className="text-sm text-brown">{order.customerEmail || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Placed</p>
                    <p className="text-sm text-brown">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="relative inline-flex items-center">
                    <select
                      value={order.status}
                      disabled={updating}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer transition-colors ${
                        STATUS_CONFIG[order.status]?.classes ?? 'bg-muted text-brown'
                      }`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s]?.label ?? s}
                        </option>
                      ))}
                    </select>
                    {updating ? (
                      <Loader2 size={11} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-current pointer-events-none" />
                    ) : (
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-stroke overflow-hidden">
                  <div className="px-6 py-4 border-b border-stroke">
                    <h2 className="font-heading text-base text-brown">Items</h2>
                  </div>
                  <div className="divide-y divide-stroke">
                    {order.items?.map((item) => (
                      <Link
                        key={item.id}
                        to={`/cakes/${item.cakeId}`}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                          {item.cakeImageUrl ? (
                            <img src={item.cakeImageUrl} alt={item.cakeName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-peach" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm text-brown">{item.cakeName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.sizeLabel} · {item.slices} slices
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.priceAtOrder)} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-brown shrink-0">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-stroke flex justify-between items-center">
                    <span className="text-sm font-semibold text-brown">Total</span>
                    <span className="font-heading text-xl text-crimson">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                {/* Note */}
                {order.note && (
                  <div className="bg-white rounded-2xl border border-stroke px-6 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Note</p>
                    <p className="text-sm text-brown">{order.note}</p>
                  </div>
                )}

                {/* Delivery address */}
                {order.deliveryCity && (
                  <div className="bg-white rounded-2xl border border-stroke px-6 py-5">
                    <h2 className="font-heading text-base text-brown mb-3">Delivery Address</h2>
                    <p className="text-sm text-brown leading-relaxed">
                      {[
                        `${order.deliveryFirstName || ''} ${order.deliveryLastName || ''}`.trim(),
                        order.deliveryAddressLine,
                        order.deliveryBuildingName,
                        order.deliveryStreetName,
                        order.deliveryPostcode,
                        order.deliveryCity,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Sidebar: timeline ─────────────────────── */}
              <div className="w-full xl:w-56 shrink-0 xl:sticky xl:top-24">
                <div className="bg-white rounded-2xl border border-stroke p-5">
                  <StatusTimeline status={order.status} />
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
