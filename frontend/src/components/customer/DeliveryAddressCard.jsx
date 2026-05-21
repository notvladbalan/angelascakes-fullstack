import { useState } from 'react';
import { Loader2, Pencil, Check, X } from 'lucide-react';
import api from '@/api/axios';
import useAuthStore from '@/store/authStore';

const inputCls = 'w-full h-9 px-3 rounded-lg border border-stroke text-sm text-brown outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson transition';

const FIELDS = [
  { key: 'addressLine',  label: 'Address line' },
  { key: 'buildingName', label: 'Building / apartment' },
  { key: 'streetName',   label: 'Street name' },
  { key: 'postcode',     label: 'Postcode' },
  { key: 'city',         label: 'City' },
];

function toForm(user) {
  return {
    addressLine:  user?.addressLine  || '',
    buildingName: user?.buildingName || '',
    streetName:   user?.streetName   || '',
    postcode:     user?.postcode     || '',
    city:         user?.city         || '',
  };
}

export default function DeliveryAddressCard() {
  const user    = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token   = useAuthStore((s) => s.token);

  const [form, setForm]           = useState(() => toForm(user));
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved]         = useState(false);

  function cancelEdit() {
    setEditing(false);
    setSaveError('');
    setForm(toForm(user));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        firstName:    user?.firstName || '',
        lastName:     user?.lastName  || '',
        addressLine:  form.addressLine,
        buildingName: form.buildingName,
        streetName:   form.streetName,
        postcode:     form.postcode,
        city:         form.city,
      };
      const { data: updated } = await api.put('/users/me', payload);
      setAuth(token, { ...updated, role: user.role });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex-1 min-w-0 bg-white rounded-2xl border border-stroke p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg text-brown">Delivery Address</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-crimson font-semibold hover:underline"
          >
            <Pencil size={13} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brown transition-colors"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs text-white bg-crimson px-3 py-1.5 rounded-lg hover:bg-crimson/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={13} />}
              Save
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            {editing ? (
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={inputCls}
              />
            ) : (
              <p className="text-sm text-brown">
                {user?.[key] || <span className="text-muted-foreground/50 italic">Not set</span>}
              </p>
            )}
          </div>
        ))}
      </div>

      {saveError && (
        <p className="mt-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {saveError}
        </p>
      )}
      {saved && (
        <p className="mt-4 text-xs text-teal bg-teal/10 border border-teal/20 px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Check size={13} />
          Address saved successfully.
        </p>
      )}
    </section>
  );
}
