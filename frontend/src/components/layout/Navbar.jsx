import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, X, Search, LayoutDashboard, Package } from 'lucide-react';

const ACTIVE_STATUSES = new Set(['PENDING', 'IN_PROGRESS', 'SHIPPED']);
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import useNotificationStore from '@/store/notificationStore';
import api from '@/api/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token       = useAuthStore((s) => s.token);
  const user        = useAuthStore((s) => s.user);
  const items       = useCartStore((s) => s.items);
  const unseenCount    = useNotificationStore((s) => s.unseenCount);
  const setUnseenCount = useNotificationStore((s) => s.setUnseenCount);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const [query, setQuery] = useState('');
  const [cakeTypeId, setCakeTypeId] = useState('');
  const [cakeTypes, setCakeTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeOrderCount, setActiveOrderCount] = useState(0);

  useEffect(() => {
    api.get('/cake-types').then((r) => setCakeTypes(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('name') || '');
    setCakeTypeId(params.get('cakeTypeId') || '');
  }, [location.search]);

  useEffect(() => {
    if (!token || user?.role === 'ADMIN') return;
    api.get('/orders/my')
      .then((r) => setActiveOrderCount(r.data.filter((o) => ACTIVE_STATUSES.has(o.status)).length))
      .catch(() => {});
  }, [location.pathname, token, user?.role]);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') return;
    api.get('/orders/unseen-count')
      .then((r) => setUnseenCount(r.data.count))
      .catch(() => {});
  }, [location.pathname, token, user?.role, setUnseenCount]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('name', query.trim());
    if (cakeTypeId) params.set('cakeTypeId', cakeTypeId);
    navigate(`/?${params.toString()}`);
  }

  function selectCakeType(id) {
    setCakeTypeId(id);
    setDropdownOpen(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('name', query.trim());
    if (id) params.set('cakeTypeId', id);
    navigate(`/?${params.toString()}`);
  }

  function handleClear() {
    setQuery('');
    setCakeTypeId('');
    navigate('/');
  }

  const selectedCakeType = cakeTypes.find((t) => String(t.id) === String(cakeTypeId));

  return (
    <header className="w-full bg-white border-b border-stroke sticky top-0 z-50">
      <div className="px-6 h-16 flex items-center gap-5">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src="/logo.svg" alt="Angela's Cakes" className="h-10 w-auto" />
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 mx-32 flex items-center border border-stroke rounded-full overflow-visible bg-white min-w-0"
          style={{ borderRadius: '9999px' }}
        >
          {/* Cake type dropdown */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 pl-5 pr-3 h-10 text-xs font-body font-semibold text-brown whitespace-nowrap border-r border-stroke hover:bg-muted/60 transition-colors rounded-l-full"
            >
              {selectedCakeType ? selectedCakeType.name : 'CAKE TYPE'}
              <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-stroke rounded-xl shadow-lg z-50 min-w-40 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => selectCakeType('')}
                  className={`w-full text-left px-4 py-2 text-sm font-body hover:bg-muted transition-colors ${!cakeTypeId ? 'text-crimson font-semibold' : 'text-brown'}`}
                >
                  All Types
                </button>
                {cakeTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectCakeType(String(t.id))}
                    className={`w-full text-left px-4 py-2 text-sm font-body hover:bg-muted transition-colors ${String(cakeTypeId) === String(t.id) ? 'text-crimson font-semibold' : 'text-brown'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a cake…"
            className="flex-1 px-4 h-10 text-sm font-body text-brown placeholder:text-muted-foreground outline-none bg-transparent min-w-0"
          />

          {/* Clear button */}
          {(query || cakeTypeId) && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 p-2 text-muted-foreground hover:text-brown transition-colors"
            >
              <X size={15} />
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="shrink-0 flex items-center gap-2 px-5 h-10 bg-crimson text-white text-sm font-body font-semibold hover:bg-crimson/90 transition-colors rounded-r-full"
          >
            <Search size={14} />
            Search
          </button>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin panel */}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Admin panel"
            >
              <LayoutDashboard size={22} className="text-crimson" />
              {unseenCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-crimson text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none">
                  {unseenCount > 99 ? '99+' : unseenCount}
                </span>
              )}
            </Link>
          )}

          {/* Customer orders */}
          {token && user?.role !== 'ADMIN' && (
            <Link
              to="/orders"
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="My orders"
            >
              <Package size={22} className="text-brown" />
              {activeOrderCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-crimson text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none">
                  {activeOrderCount > 99 ? '99+' : activeOrderCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={22} className="text-brown" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-crimson text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          <Link
            to={token ? '/dashboard' : '/login'}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={token ? 'My account' : 'Login'}
          >
            <User size={22} className="text-brown" />
          </Link>
        </div>

      </div>
    </header>
  );
}
