import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { formatPrice } from '@/utils/format';
import api from '@/api/axios';
import useCartStore from '@/store/cartStore';

export default function CakeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [cake, setCake]         = useState(null);
  const [sizes, setSizes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity]         = useState(1);
  const [addedFlash, setAddedFlash]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/cakes/${id}`)
      .then((r) => {
        setCake(r.data);
        const sizeList = r.data.sizes ?? [];
        setSizes(sizeList);
        if (sizeList.length > 0) {
          setSelectedSize(sizeList[Math.floor(sizeList.length / 2)]);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) navigate('/not-found', { replace: true });
        else setError('Failed to load cake details. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  function adjustQty(delta) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  function handleAddToCart() {
    if (!selectedSize || !cake) return;
    addItem(cake, selectedSize, quantity);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2000);
  }

  function handleBuyNow() {
    if (!selectedSize || !cake) return;
    addItem(cake, selectedSize, quantity);
    navigate('/cart');
  }

  const totalPrice = selectedSize ? Number(selectedSize.price) * quantity : 0;

  /* ── Loading ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 size={36} className="animate-spin text-crimson" />
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────── */
  if (error || !cake) {
    return (
      <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="font-heading text-2xl text-brown">{error || 'Cake not found.'}</p>
          <Link to="/" className="text-sm text-crimson font-semibold hover:underline">
            ← Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  /* ── Page ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 py-8">
      <div className="max-w-5xl mx-auto px-6">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brown transition-colors mb-7"
        >
          <ChevronLeft size={15} />
          Back to catalogue
        </button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Left: image ─────────────────────────────── */}
          <div className="lg:w-[44%] shrink-0">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-stroke">
              {cake.imageUrl ? (
                <img
                  src={cake.imageUrl}
                  alt={cake.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/25">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2C9 2 7 4 7 6v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6c0-2-2-4-5-4z" />
                    <path d="M9 6c0-1.1.9-2 3-2s3 .9 3 2" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: details ──────────────────────────── */}
          <div className="flex-1 flex flex-col">

            {/* Cake type label */}
            {cake.cakeTypeName && (
              <span className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">
                {cake.cakeTypeName}
              </span>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl lg:text-4xl text-brown leading-snug mb-3">
              {cake.name}
            </h1>

            {/* Flavor */}
            {cake.flavorName && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Flavour:</span>
                <span className="text-xs font-semibold text-brown bg-peach px-2.5 py-1 rounded-full">
                  {cake.flavorName}
                </span>
              </div>
            )}

            {/* Decoration tags */}
            {cake.decorationNames?.length > 0 && (
              <div className="flex items-start gap-2 mb-4">
                <span className="text-xs text-muted-foreground mt-1 shrink-0">Decorations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cake.decorationNames.map((d) => (
                    <span key={d} className="text-xs bg-peach text-brown px-2.5 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {cake.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                {cake.description}
              </p>
            )}

            {/* Size selector */}
            {sizes.length > 0 ? (
              <div className="mb-6">
                <p className="text-sm font-semibold text-brown mb-3">Choose a size</p>
                <div className="flex flex-col gap-2">
                  {sizes.map((size) => {
                    const active = selectedSize?.id === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-body transition-all ${
                          active
                            ? 'border-crimson bg-crimson/5'
                            : 'border-stroke bg-white hover:border-crimson/40 hover:bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {/* Radio dot */}
                          <span
                            className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${
                              active ? 'border-crimson bg-crimson' : 'border-stroke bg-white'
                            }`}
                          />
                          <span className="font-semibold text-brown">{size.label}</span>
                          <span className="text-muted-foreground text-xs">· {size.slices} slices</span>
                        </span>
                        <span className={`font-heading text-base ${active ? 'text-crimson' : 'text-brown'}`}>
                          {formatPrice(size.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mb-6 px-4 py-3 rounded-xl bg-white border border-stroke text-sm text-muted-foreground">
                No sizes have been configured for this cake yet.
              </div>
            )}

            {/* Quantity */}
            {sizes.length > 0 && (
              <div className="mb-7">
                <p className="text-sm font-semibold text-brown mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustQty(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-stroke bg-white flex items-center justify-center text-brown hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-semibold text-brown">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustQty(1)}
                    className="w-10 h-10 rounded-lg border border-stroke bg-white flex items-center justify-center text-brown hover:bg-muted transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Total + CTA */}
            {sizes.length > 0 && selectedSize && (
              <div className="mt-auto pt-6 border-t border-stroke flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {quantity > 1 ? `${quantity} × ${formatPrice(selectedSize.price)}` : 'Total'}
                  </span>
                  <span className="font-heading text-2xl text-crimson">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedFlash
                      ? 'bg-teal text-white'
                      : 'bg-crimson text-white hover:bg-crimson/90 active:scale-[0.98]'
                  }`}
                >
                  <ShoppingCart size={17} />
                  {addedFlash ? 'Added to cart!' : 'Add to Cart'}
                </button>

                {/* Buy now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full h-12 rounded-xl text-sm font-semibold border border-crimson text-crimson hover:bg-crimson/5 active:bg-crimson/10 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
