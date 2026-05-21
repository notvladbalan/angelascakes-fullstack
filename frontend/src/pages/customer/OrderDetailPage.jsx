import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, XCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CustomerSidebar from '@/components/layout/CustomerSidebar';
import StatusBadge from '@/components/order/StatusBadge';
import StatusTimeline from '@/components/order/StatusTimeline';
import Modal from '@/components/admin/Modal';
import { formatPrice, formatDateTime } from '@/utils/format';
import api from '@/api/axios';

const CANCELLABLE = new Set(['PENDING', 'IN_PROGRESS']);

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    api.get(`/orders/my/${id}`)
      .then((r) => setOrder(r.data))
      .catch((err) => {
        if (err.response?.status === 404) navigate('/not-found', { replace: true });
        else setError('Failed to load order.');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      const { data } = await api.post(`/orders/my/${id}/cancel`);
      setOrder(data);
      setCancelOpen(false);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <CustomerSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">

          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brown transition-colors mb-6"
          >
            <ChevronLeft size={15} />
            Back to orders
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : error || !order ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
              <Link to="/orders" className="text-sm text-crimson font-semibold hover:underline">
                ← Back to orders
              </Link>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row gap-8 items-start">

              {/* ── Main: items + address ─────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Header */}
                <div className="bg-white rounded-2xl border border-stroke px-6 py-5 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Order
                    </p>
                    <p className="font-heading text-2xl text-brown">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Placed
                    </p>
                    <p className="text-sm text-brown">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Items table */}
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
                    <span className="font-heading text-xl text-crimson">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Note */}
                {order.note && (
                  <div className="bg-white rounded-2xl border border-stroke px-6 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Note
                    </p>
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

              {/* ── Sidebar: timeline + cancel ───────────── */}
              <div className="w-full xl:w-56 shrink-0 xl:sticky xl:top-24 flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-stroke p-5">
                  <StatusTimeline status={order.status} />
                </div>

                {CANCELLABLE.has(order.status) && (
                  <button
                    onClick={() => { setCancelOpen(true); setCancelError(''); }}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={15} />
                    Cancel Order
                  </button>
                )}
              </div>

            </div>
          )}
        </main>
      </div>

      {cancelOpen && (
        <Modal title="Cancel Order" onClose={() => setCancelOpen(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel order <span className="font-semibold text-brown">#{order?.id}</span>? This action cannot be undone.
            </p>
            {cancelError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{cancelError}</p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setCancelOpen(false)}
                className="flex-1 h-10 rounded-xl border border-stroke text-sm text-brown hover:bg-muted transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {cancelling && <Loader2 size={14} className="animate-spin" />}
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
