import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/order/StatusBadge';
import { formatPrice, formatDate } from '@/utils/format';

export default function ActiveOrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stroke overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-3 border-b border-stroke">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <p className="font-heading text-base text-brown">Order #{order.id}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-xs text-muted-foreground shrink-0">
          {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Items */}
      <div className="divide-y divide-stroke">
        {order.items?.map((item) => (
          <div key={item.id} className="px-5 py-3.5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-muted">
              {item.cakeImageUrl ? (
                <img src={item.cakeImageUrl} alt={item.cakeName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-peach" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brown truncate">{item.cakeName}</p>
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

      {/* Footer */}
      <div className="px-5 py-4 border-t border-stroke flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-heading text-lg text-crimson">{formatPrice(order.totalPrice)}</span>
        </div>
        <Link
          to={`/orders/${order.id}`}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-crimson text-white text-xs font-semibold hover:bg-crimson/90 transition-colors"
        >
          View Details
          <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  );
}
