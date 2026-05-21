import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CartItem from '@/components/cart/CartItem';
import { formatPrice } from '@/utils/format';
import api from '@/api/axios';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';

export default function CartPage() {
  const navigate = useNavigate();

  const items          = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const clearCart      = useCartStore((s) => s.clearCart);

  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const subtotal   = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const hasAddress = !!(user?.addressLine || user?.streetName || user?.city);

  async function handleCheckout() {
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        items: items.map((item) => ({
          cakeId:     item.cakeId,
          cakeSizeId: item.sizeId,
          quantity:   item.quantity,
        })),
        note: note.trim() || null,
      };
      const { data: order } = await api.post('/orders', payload);
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Empty state ─────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <ShoppingCart size={52} className="text-muted-foreground/25" strokeWidth={1.2} />
          <p className="font-heading text-2xl text-brown">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add some cakes and come back here.</p>
          <Link
            to="/"
            className="mt-2 h-11 px-7 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center hover:bg-crimson/90 transition-colors"
          >
            Browse Cakes
          </Link>
        </div>
      </div>
    );
  }

  /* ── Cart ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 py-8">
        <h1 className="font-heading text-2xl text-brown mb-6">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Items list ──────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {items.map((item) => (
              <CartItem
                key={`${item.cakeId}-${item.sizeId}`}
                item={item}
                onUpdateQty={(qty) => updateQuantity(item.cakeId, item.sizeId, qty)}
                onRemove={() => removeItem(item.cakeId, item.sizeId)}
              />
            ))}

            <Link
              to="/"
              className="mt-1 self-start text-sm text-muted-foreground hover:text-brown transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* ── Order summary sidebar ───────────────────── */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-stroke p-6 flex flex-col gap-5">
              <h2 className="font-heading text-lg text-brown">Order Summary</h2>

              {/* Per-item breakdown */}
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div
                    key={`${item.cakeId}-${item.sizeId}`}
                    className="flex justify-between text-sm text-muted-foreground gap-2"
                  >
                    <span className="truncate">
                      {item.cakeName}{' '}
                      <span className="text-xs">({item.sizeLabel})</span>
                      {item.quantity > 1 && ` × ${item.quantity}`}
                    </span>
                    <span className="shrink-0">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-stroke pt-4">
                <span className="text-sm font-semibold text-brown">Total</span>
                <span className="font-heading text-2xl text-crimson">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Note */}
              <div>
                <label htmlFor="order-note" className="block text-sm font-semibold text-brown mb-2">
                  Note <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="order-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Allergies, special requests, occasion…"
                  className="w-full px-3 py-2.5 rounded-lg border border-stroke bg-[#FFF5EC] text-sm text-brown placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson transition resize-none"
                />
              </div>

              {/* Address warning */}
              {token && user && !hasAddress && (
                <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    No delivery address on your profile.{' '}
                    <Link to="/dashboard" className="font-semibold underline hover:no-underline">
                      Add one
                    </Link>{' '}
                    before placing your order.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle size={15} className="shrink-0 text-red-500 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 active:bg-crimson/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {!token ? 'Log in to Checkout' : loading ? 'Placing order…' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
