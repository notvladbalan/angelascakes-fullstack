import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronDown, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { STATUS_CONFIG, ORDER_STATUSES } from '@/utils/orderStatus';
import { formatPrice, formatDate } from '@/utils/format';
import useNotificationStore from '@/store/notificationStore';
import api from '@/api/axios';

function SortButton({ label, column, sortKey, sortDir, onSort }) {
  const active = sortKey === column;
  const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="flex items-center gap-1 group select-none"
    >
      {label}
      <Icon
        size={12}
        className={active ? 'text-crimson' : 'text-muted-foreground/40 group-hover:text-muted-foreground transition-colors'}
      />
    </button>
  );
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const setUnseenCount = useNotificationStore((s) => s.setUnseenCount);
  const decrement      = useNotificationStore((s) => s.decrement);

  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [updating, setUpdating] = useState(null);

  const [searchEmail, setSearchEmail]   = useState(() => sessionStorage.getItem('adminOrders.searchEmail') ?? '');
  const [statusFilter, setStatusFilter] = useState(() => sessionStorage.getItem('adminOrders.statusFilter') ?? '');
  const [seenFilter, setSeenFilter]     = useState(() => sessionStorage.getItem('adminOrders.seenFilter') ?? '');
  const [sortKey, setSortKey]           = useState(() => sessionStorage.getItem('adminOrders.sortKey') ?? 'createdAt');
  const [sortDir, setSortDir]           = useState(() => sessionStorage.getItem('adminOrders.sortDir') ?? 'desc');

  useEffect(() => { sessionStorage.setItem('adminOrders.searchEmail', searchEmail); }, [searchEmail]);
  useEffect(() => { sessionStorage.setItem('adminOrders.statusFilter', statusFilter); }, [statusFilter]);
  useEffect(() => { sessionStorage.setItem('adminOrders.seenFilter', seenFilter); }, [seenFilter]);
  useEffect(() => { sessionStorage.setItem('adminOrders.sortKey', sortKey); }, [sortKey]);
  useEffect(() => { sessionStorage.setItem('adminOrders.sortDir', sortDir); }, [sortDir]);

  useEffect(() => {
    api.get('/orders')
      .then((r) => {
        setOrders(r.data);
        setUnseenCount(r.data.filter((o) => !o.seen).length);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [setUnseenCount]);

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => {
        const old = prev.find((o) => o.id === orderId);
        if (old && !old.seen) decrement();
        return prev.map((o) => (o.id === orderId ? data : o));
      });
      api.put(`/orders/${orderId}/seen`).catch(() => {});
    } catch {
      // silent
    } finally {
      setUpdating(null);
    }
  }

  async function handleMarkSeen(orderId) {
    try {
      await api.put(`/orders/${orderId}/seen`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, seen: true } : o)));
      decrement();
    } catch {
      // silent
    }
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const displayed = useMemo(() => {
    let result = orders;

    if (searchEmail.trim()) {
      const q = searchEmail.toLowerCase();
      result = result.filter((o) => o.customerEmail?.toLowerCase().includes(q));
    }

    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (seenFilter === 'unseen') result = result.filter((o) => !o.seen);
    if (seenFilter === 'seen')   result = result.filter((o) =>  o.seen);

    result = [...result].sort((a, b) => {
      // Unseen always floats to the top
      if (a.seen !== b.seen) return a.seen ? 1 : -1;

      if (!sortKey) return 0;
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'totalPrice') { av = Number(av); bv = Number(bv); }
      if (sortKey === 'createdAt')  { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchEmail, statusFilter, seenFilter, sortKey, sortDir]);

  const thCls = 'px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left';

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <AdminSidebar />
        <div className="flex-1 px-6 py-8">
          <h1 className="font-heading text-2xl text-brown mb-6">All Orders</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <>
              {/* ── Toolbar ──────────────────────────────── */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-48 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Search by email…"
                    className="w-full pl-9 pr-8 h-9 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white"
                  />
                  {searchEmail && (
                    <button
                      type="button"
                      onClick={() => setSearchEmail('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brown transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white cursor-pointer"
                >
                  <option value="">All statuses</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                  ))}
                </select>

                <select
                  value={seenFilter}
                  onChange={(e) => setSeenFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white cursor-pointer"
                >
                  <option value="">All orders</option>
                  <option value="unseen">Unseen</option>
                  <option value="seen">Seen</option>
                </select>

                {(searchEmail || statusFilter || seenFilter) && (
                  <button
                    type="button"
                    onClick={() => { setSearchEmail(''); setStatusFilter(''); setSeenFilter(''); }}
                    className="text-xs text-crimson font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                )}

                <span className="ml-auto text-xs text-muted-foreground">
                  {displayed.length} order{displayed.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* ── Table ────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-stroke overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stroke">
                      <th className={thCls}>
                        <SortButton label="ORDER" column="id" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className={`${thCls} hidden md:table-cell`}>CUSTOMER</th>
                      <th className={`${thCls} hidden sm:table-cell`}>
                        <SortButton label="DATE" column="createdAt" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className={thCls}>
                        <SortButton label="TOTAL" column="totalPrice" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className={thCls}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke">
                    {displayed.map((order) => (
                      <tr
                        key={order.id}
                        className={`transition-colors cursor-pointer ${
                          !order.seen ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-muted/30'
                        }`}
                        onClick={() => {
                          if (!order.seen) handleMarkSeen(order.id);
                          navigate(`/admin/orders/${order.id}`);
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {!order.seen && (
                              <span className="w-2 h-2 rounded-full bg-crimson shrink-0" title="New" />
                            )}
                            <div>
                              <p className="font-heading text-sm text-brown">#{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-brown hidden md:table-cell">
                          <p>{order.customerEmail || '—'}</p>
                          {(order.deliveryFirstName || order.deliveryLastName) && (
                            <p className="text-xs text-muted-foreground">
                              {`${order.deliveryFirstName || ''} ${order.deliveryLastName || ''}`.trim()}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-brown hidden sm:table-cell">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 font-heading text-crimson">
                          {formatPrice(order.totalPrice)}
                        </td>

                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-flex items-center">
                            <select
                              value={order.status}
                              disabled={updating === order.id}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer transition-colors ${
                                STATUS_CONFIG[order.status]?.classes ?? 'bg-muted text-brown'
                              }`}
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                              ))}
                            </select>
                            {updating === order.id ? (
                              <Loader2 size={11} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-current pointer-events-none" />
                            ) : (
                              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {displayed.length === 0 && (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    {orders.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
