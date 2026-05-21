import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Pencil, Check, Search, ArrowUpDown, ArrowUp, ArrowDown, X, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Modal from '@/components/admin/Modal';
import Field, { inputCls } from '@/components/admin/Field';
import ImageUploader from '@/components/admin/ImageUploader';
import { formatPrice } from '@/utils/format';
import api from '@/api/axios';

const EMPTY_FORM = {
  name: '', description: '', imageUrl: '', price: '',
  cakeTypeId: '', flavorId: '', decorationIds: [],
};

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

export default function AdminCakesPage() {
  const navigate = useNavigate();

  const [cakes, setCakes]             = useState([]);
  const [flavors, setFlavors]         = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [cakeTypes, setCakeTypes]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');

  const [togglingId, setTogglingId] = useState(null);

  const [searchName, setSearchName]         = useState(() => sessionStorage.getItem('adminCakes.searchName') ?? '');
  const [cakeTypeFilter, setCakeTypeFilter] = useState(() => sessionStorage.getItem('adminCakes.cakeTypeFilter') ?? '');
  const [availFilter, setAvailFilter]       = useState(() => sessionStorage.getItem('adminCakes.availFilter') ?? '');
  const [sortKey, setSortKey]               = useState(() => sessionStorage.getItem('adminCakes.sortKey') ?? 'available');
  const [sortDir, setSortDir]               = useState(() => sessionStorage.getItem('adminCakes.sortDir') ?? 'desc');

  useEffect(() => { sessionStorage.setItem('adminCakes.searchName', searchName); }, [searchName]);
  useEffect(() => { sessionStorage.setItem('adminCakes.cakeTypeFilter', cakeTypeFilter); }, [cakeTypeFilter]);
  useEffect(() => { sessionStorage.setItem('adminCakes.availFilter', availFilter); }, [availFilter]);
  useEffect(() => { sessionStorage.setItem('adminCakes.sortKey', sortKey); }, [sortKey]);
  useEffect(() => { sessionStorage.setItem('adminCakes.sortDir', sortDir); }, [sortDir]);

  useEffect(() => {
    Promise.all([
      api.get('/cakes/admin/all', { params: { size: 200 } }),
      api.get('/flavors'),
      api.get('/decorations'),
      api.get('/cake-types'),
    ])
      .then(([cakesRes, flavorsRes, decsRes, typesRes]) => {
        setCakes(cakesRes.data.content);
        setFlavors(flavorsRes.data);
        setDecorations(decsRes.data);
        setCakeTypes(typesRes.data);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    const regularType = cakeTypes.find((t) => t.name.toLowerCase() === 'regular');
    setForm({ ...EMPTY_FORM, cakeTypeId: regularType ? String(regularType.id) : '' });
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormError('');
  }

  function toggleDecoration(id) {
    setForm((f) => ({
      ...f,
      decorationIds: f.decorationIds.includes(id)
        ? f.decorationIds.filter((d) => d !== id)
        : [...f.decorationIds, id],
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) {
      setFormError('Name and price are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    const payload = {
      name:          form.name.trim(),
      description:   form.description.trim() || null,
      imageUrl:      form.imageUrl.trim() || null,
      price:         parseFloat(form.price),
      cakeTypeId:    form.cakeTypeId ? Number(form.cakeTypeId) : null,
      flavorId:      form.flavorId ? Number(form.flavorId) : null,
      decorationIds: form.decorationIds,
    };
    try {
      const { data } = await api.post('/cakes', payload);
      setCakes((prev) => [data, ...prev]);
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleAvailability(cake) {
    setTogglingId(cake.id);
    try {
      const { data } = await api.patch(`/cakes/${cake.id}/availability`, { available: !cake.available });
      setCakes((prev) => prev.map((c) => (c.id === cake.id ? data : c)));
    } catch {
      // silent; state unchanged
    } finally {
      setTogglingId(null);
    }
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const displayed = useMemo(() => {
    let result = cakes;

    if (searchName.trim()) {
      const q = searchName.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (cakeTypeFilter) {
      result = result.filter((c) => String(c.cakeTypeId) === cakeTypeFilter);
    }

    if (availFilter === 'available') {
      result = result.filter((c) => c.available);
    } else if (availFilter === 'unavailable') {
      result = result.filter((c) => !c.available);
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        let av = a[sortKey];
        let bv = b[sortKey];
        if (sortKey === 'price')     { av = Number(av); bv = Number(bv); }
        if (sortKey === 'name')      { av = av?.toLowerCase() ?? ''; bv = bv?.toLowerCase() ?? ''; }
        if (sortKey === 'available') { av = av ? 1 : 0; bv = bv ? 1 : 0; }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
    }

    return result;
  }, [cakes, searchName, cakeTypeFilter, availFilter, sortKey, sortDir]);

  const thCls = 'px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left';

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <AdminSidebar />
        <div className="flex-1 px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl text-brown">Manage Cakes</h1>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-crimson text-white text-sm font-semibold hover:bg-crimson/90 transition-colors"
            >
              <Plus size={16} />
              Add Cake
            </button>
          </div>

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
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by name…"
                    className="w-full pl-9 pr-8 h-9 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white"
                  />
                  {searchName && (
                    <button
                      type="button"
                      onClick={() => setSearchName('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brown transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <select
                  value={cakeTypeFilter}
                  onChange={(e) => setCakeTypeFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white cursor-pointer"
                >
                  <option value="">All types</option>
                  {cakeTypes.map((t) => (
                    <option key={t.id} value={String(t.id)}>{t.name}</option>
                  ))}
                </select>

                <select
                  value={availFilter}
                  onChange={(e) => setAvailFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg border border-stroke text-sm text-brown outline-none focus:border-crimson/50 bg-white cursor-pointer"
                >
                  <option value="">All statuses</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Not available</option>
                </select>

                {(searchName || cakeTypeFilter || availFilter) && (
                  <button
                    type="button"
                    onClick={() => { setSearchName(''); setCakeTypeFilter(''); setAvailFilter(''); }}
                    className="text-xs text-crimson font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                )}

                <span className="ml-auto text-xs text-muted-foreground">
                  {displayed.length} cake{displayed.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* ── Table ────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-stroke overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stroke">
                      <th className={`${thCls} w-44`}>
                        <SortButton label="CAKE" column="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className={`${thCls} hidden md:table-cell whitespace-nowrap`}>CAKE TYPE</th>
                      <th className={thCls}>
                        <SortButton label="PRICE" column="price" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className={`${thCls} hidden lg:table-cell`}>DECORATIONS</th>
                      <th className={`${thCls} hidden sm:table-cell`}>
                        <SortButton label="STATUS" column="available" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                      </th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke">
                    {displayed.map((cake) => (
                      <tr
                        key={cake.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                              {cake.imageUrl ? (
                                <img src={cake.imageUrl} alt={cake.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-peach" />
                              )}
                            </div>
                            <div>
                              <p className={`font-heading text-sm ${cake.available ? 'text-brown' : 'text-muted-foreground'}`}>{cake.name}</p>
                              {cake.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-xs">{cake.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-brown hidden md:table-cell">
                          {cake.cakeTypeName || <span className="text-muted-foreground/40">-</span>}
                        </td>
                        <td className="px-5 py-4 font-heading text-crimson">{formatPrice(cake.price)}</td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {cake.decorationNames?.slice(0, 3).map((d) => (
                              <span key={d} className="text-[11px] bg-peach text-brown px-2 py-0.5 rounded-full">{d}</span>
                            ))}
                            {cake.decorationNames?.length > 3 && (
                              <span className="text-[11px] text-muted-foreground">+{cake.decorationNames.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            cake.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {cake.available ? <Eye size={11} /> : <EyeOff size={11} />}
                            {cake.available ? 'Available' : 'Not available'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleAvailability(cake); }}
                              disabled={togglingId === cake.id}
                              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                                cake.available
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
                              }`}
                              aria-label={cake.available ? 'Make unavailable' : 'Make available'}
                            >
                              {togglingId === cake.id
                                ? <Loader2 size={15} className="animate-spin" />
                                : cake.available ? <EyeOff size={15} /> : <Eye size={15} />
                              }
                            </button>
                            <button
                              onClick={() => navigate(`/admin/cakes/${cake.id}`)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-brown hover:bg-muted transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {displayed.length === 0 && (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    {cakes.length === 0 ? 'No cakes yet. Add one above.' : 'No cakes match your filters.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {modalOpen && (
          <Modal title="Add Cake" onClose={closeModal} className="max-w-2xl">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* ── Left column ── */}
                <div className="flex flex-col gap-4">
                  <Field label="Name *">
                    <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Raspberry Cheesecake" />
                  </Field>
                  <Field label="Cake Type">
                    <select value={form.cakeTypeId} onChange={(e) => setForm((f) => ({ ...f, cakeTypeId: e.target.value }))} className={inputCls}>
                      {cakeTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Description">
                    <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none`} placeholder="A short description..." />
                  </Field>
                  <Field label="Image">
                    <ImageUploader value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
                  </Field>
                </div>

                {/* ── Right column ── */}
                <div className="flex flex-col gap-4">
                  <Field label="Base price ($) *">
                    <input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="25.00" />
                  </Field>
                  <Field label="Flavour">
                    <select value={form.flavorId} onChange={(e) => setForm((f) => ({ ...f, flavorId: e.target.value }))} className={inputCls}>
                      <option value="">None</option>
                      {flavors.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Decorations">
                    <div className="flex flex-wrap gap-2 pt-1">
                      {decorations.map((d) => {
                        const checked = form.decorationIds.includes(d.id);
                        return (
                          <button key={d.id} type="button" onClick={() => toggleDecoration(d.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${checked ? 'bg-crimson/10 border-crimson text-crimson' : 'border-stroke text-brown hover:border-crimson/40'}`}>
                            {checked && <Check size={11} />}
                            {d.name}
                          </button>
                        );
                      })}
                      {decorations.length === 0 && <span className="text-xs text-muted-foreground">No decorations available.</span>}
                    </div>
                  </Field>
                </div>
              </div>

              {formError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>}
              <div className="flex gap-2">
                <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-stroke text-sm text-brown hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 h-10 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 transition-colors disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Saving...' : 'Add Cake'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
