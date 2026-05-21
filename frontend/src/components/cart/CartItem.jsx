import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/utils/format';

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-stroke p-4 flex gap-4">

      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
        {item.cakeImageUrl ? (
          <img src={item.cakeImageUrl} alt={item.cakeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-peach" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-heading text-base text-brown leading-snug">{item.cakeName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.sizeLabel} · {item.slices} slices
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatPrice(item.price)} each
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateQty(item.quantity - 1)}
            className="w-7 h-7 rounded-lg border border-stroke flex items-center justify-center text-brown hover:bg-muted transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-brown">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQty(item.quantity + 1)}
            className="w-7 h-7 rounded-lg border border-stroke flex items-center justify-center text-brown hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>

        <span className="font-heading text-lg text-crimson">
          {formatPrice(Number(item.price) * item.quantity)}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/60 hover:text-crimson transition-colors"
          aria-label={`Remove ${item.cakeName}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

    </div>
  );
}
