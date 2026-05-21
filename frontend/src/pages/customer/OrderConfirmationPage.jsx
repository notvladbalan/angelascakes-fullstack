import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import StatusBadge from '@/components/order/StatusBadge';
import { formatPrice, formatDateLong } from '@/utils/format';

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">

        {/* Success banner */}
        <div className="flex flex-col items-center text-center mb-10">
          <CheckCircle size={56} className="text-teal mb-4" strokeWidth={1.5} />
          <h1 className="font-heading text-3xl text-brown mb-2">Order placed!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for your order. We&apos;ll start preparing it right away.
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl border border-stroke overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-stroke flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                Order ID
              </p>
              <p className="font-heading text-lg text-brown">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                Placed on
              </p>
              <p className="text-sm text-brown">{formatDateLong(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div className="divide-y divide-stroke">
            {order.items?.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
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
                    {item.sizeLabel} · {item.slices} slices · qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-brown shrink-0">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          {order.note && (
            <div className="px-6 py-4 border-t border-stroke bg-muted/40">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Note</p>
              <p className="text-sm text-brown">{order.note}</p>
            </div>
          )}

          {/* Total */}
          <div className="px-6 py-4 border-t border-stroke flex justify-between items-center">
            <span className="text-sm font-semibold text-brown">Total paid</span>
            <span className="font-heading text-2xl text-crimson">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to={`/orders/${order.id}`}
            className="flex-1 h-11 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center hover:bg-crimson/90 transition-colors"
          >
            View Order Details
          </Link>
          <Link
            to="/"
            className="flex-1 h-11 rounded-xl border border-stroke text-brown text-sm font-semibold flex items-center justify-center hover:bg-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
