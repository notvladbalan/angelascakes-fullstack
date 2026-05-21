import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Field, { inputCls } from '@/components/admin/Field';
import ImageUploader from '@/components/admin/ImageUploader';
import CakeSizesEditor from '@/components/admin/CakeSizesEditor';
import api from '@/api/axios';

export default function AdminCakeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cake, setCake]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const [form, setForm]             = useState(null);
  const [flavors, setFlavors]         = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [cakeTypes, setCakeTypes]     = useState([]);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [sizes, setSizes]           = useState([]);
  const [toggling, setToggling]     = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/cakes/${id}`),
      api.get('/flavors'),
      api.get('/decorations'),
      api.get('/cake-types'),
    ])
      .then(([cakeRes, flavorsRes, decsRes, typesRes]) => {
        const c = cakeRes.data;
        setCake(c);
        setSizes(c.sizes || []);
        setFlavors(flavorsRes.data);
        setDecorations(decsRes.data);
        setCakeTypes(typesRes.data);

        setForm({
          name:          c.name          || '',
          description:   c.description   || '',
          imageUrl:      c.imageUrl      || '',
          cakeTypeId:    c.cakeTypeId ? String(c.cakeTypeId) : '',
          flavorId:      c.flavorId ? String(c.flavorId) : '',
          decorationIds: c.decorationIds ? [...c.decorationIds] : [],
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) navigate('/not-found', { replace: true });
        else setError('Failed to load cake.');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function toggleDecoration(decId) {
    setForm((f) => ({
      ...f,
      decorationIds: f.decorationIds.includes(decId)
        ? f.decorationIds.filter((d) => d !== decId)
        : [...f.decorationIds, decId],
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setSaveError('Name is required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    const payload = {
      name:          form.name.trim(),
      description:   form.description.trim() || null,
      imageUrl:      form.imageUrl.trim()    || null,
      price:         cake.price,
      cakeTypeId:    form.cakeTypeId ? Number(form.cakeTypeId) : null,
      flavorId:      form.flavorId ? Number(form.flavorId) : null,
      decorationIds: form.decorationIds,
    };
    try {
      const { data } = await api.put(`/cakes/${id}`, payload);
      setCake(data);
      setSizes(data.sizes || []);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleAvailability() {
    setToggling(true);
    try {
      const { data } = await api.patch(`/cakes/${id}/availability`, { available: !cake.available });
      setCake(data);
    } catch {
      // silent
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <AdminSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brown transition-colors mb-6"
          >
            <ChevronLeft size={15} />
            Back to cakes
          </button>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : error || !form ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-red-600">{error || 'Cake not found.'}</p>
              <Link to="/admin/cakes" className="text-sm text-crimson font-semibold hover:underline">
                ← Back to cakes
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
            <div className="flex flex-col xl:flex-row gap-8 items-start">

              {/* ── Main — editable fields ─────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Header */}
                <div className="bg-white rounded-2xl border border-stroke px-6 py-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt={form.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-peach" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Cake</p>
                    <p className="font-heading text-2xl text-brown">{cake.name}</p>
                  </div>
                </div>

                {/* Edit form */}
                <div className="bg-white rounded-2xl border border-stroke px-6 py-5 flex flex-col gap-4">
                  <h2 className="font-heading text-base text-brown">Details</h2>

                  <Field label="Name *">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Cake Type">
                    <select
                      value={form.cakeTypeId}
                      onChange={(e) => setForm((f) => ({ ...f, cakeTypeId: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="">None</option>
                      {cakeTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  <Field label="Image">
                    <ImageUploader
                      value={form.imageUrl}
                      onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                    />
                  </Field>

                </div>
              </div>

              {/* ── Sidebar — sizes + extra fields ─────────── */}
              <div className="w-full xl:w-104 shrink-0 flex flex-col gap-5 xl:sticky xl:top-24">
                <CakeSizesEditor
                  cakeId={Number(id)}
                  sizes={sizes}
                  onChange={setSizes}
                />

                <div className="bg-white rounded-2xl border border-stroke px-6 py-5 flex flex-col gap-4">
                  <h2 className="font-heading text-base text-brown">Attributes</h2>

                  <Field label="Flavour">
                    <select
                      value={form.flavorId}
                      onChange={(e) => setForm((f) => ({ ...f, flavorId: e.target.value }))}
                      className={inputCls}
                    >
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
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => toggleDecoration(d.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                              checked
                                ? 'bg-crimson/10 border-crimson text-crimson'
                                : 'border-stroke text-brown hover:border-crimson/40'
                            }`}
                          >
                            {checked && <Check size={11} />}
                            {d.name}
                          </button>
                        );
                      })}
                      {decorations.length === 0 && (
                        <span className="text-xs text-muted-foreground">No decorations available.</span>
                      )}
                    </div>
                  </Field>
                </div>

                {/* ── Save ───────────────────────────────────── */}
                {saveError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    {saveError}
                  </p>
                )}
                {saveSuccess && (
                  <p className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                    Changes saved successfully.
                  </p>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-10 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>

                <button
                  onClick={handleToggleAvailability}
                  disabled={toggling}
                  className={`w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors disabled:opacity-60 ${
                    cake.available
                      ? 'border-muted-foreground/30 text-muted-foreground hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {toggling
                    ? <Loader2 size={14} className="animate-spin" />
                    : cake.available ? <EyeOff size={14} /> : <Eye size={14} />
                  }
                  {toggling ? '…' : cake.available ? 'Make Unavailable' : 'Make Available'}
                </button>
              </div>

            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
