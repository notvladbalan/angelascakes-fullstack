import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '@/utils/format';
import StatusBadge from '@/components/order/StatusBadge';

export default function OrderCard({ order }) {
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <Link
      to={`/orders/${order.id}`}
      className="bg-white rounded-2xl border border-stroke p-5 flex items-center gap-5 hover:shadow-md transition-shadow group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-heading text-base text-brown">Order #{order.id}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
        </p>
        {order.note && (
          <p className="text-xs text-muted-foreground mt-1 truncate italic">
            &ldquo;{order.note}&rdquo;
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="font-heading text-lg text-crimson">
          {formatPrice(order.totalPrice)}
        </span>
        <span className="text-muted-foreground group-hover:text-brown transition-colors text-sm">
          →
        </span>
      </div>
    </Link>
  );
}
