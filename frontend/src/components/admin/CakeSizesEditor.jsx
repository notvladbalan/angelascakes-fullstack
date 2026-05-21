import { useState } from 'react';
import { Loader2, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import api from '@/api/axios';

const cellCls =
  'text-xs px-2 py-1.5 border border-stroke rounded-lg outline-none focus:border-crimson/50 w-full';

export default function CakeSizesEditor({ cakeId, sizes, onChange }) {
  const [editRow, setEditRow]     = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [addOpen, setAddOpen]     = useState(false);
  const [newRow, setNewRow]       = useState({ label: '', slices: '', price: '' });
  const [addSaving, setAddSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [error, setError]           = useState('');

  async function handleDelete(sizeId) {
    setDeletingId(sizeId);
    setError('');
    try {
      await api.delete(`/cakes/${cakeId}/sizes/${sizeId}`);
      onChange(sizes.filter((s) => s.id !== sizeId));
    } catch {
      setError('Failed to delete size.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleEditSave() {
    if (!editRow.label.trim() || !editRow.slices || !editRow.price) {
      setError('All fields are required.');
      return;
    }
    setEditSaving(true);
    setError('');
    try {
      await api.delete(`/cakes/${cakeId}/sizes/${editRow.id}`);
      const { data } = await api.post(`/cakes/${cakeId}/sizes`, {
        label:  editRow.label.trim(),
        slices: parseInt(editRow.slices, 10),
        price:  parseFloat(editRow.price),
      });
      onChange(sizes.map((s) => (s.id === editRow.id ? data : s)));
      setEditRow(null);
    } catch {
      setError('Failed to update size.');
    } finally {
      setEditSaving(false);
    }
  }

  async function handleAdd() {
    if (!newRow.label.trim() || !newRow.slices || !newRow.price) {
      setError('All fields are required.');
      return;
    }
    setAddSaving(true);
    setError('');
    try {
      const { data } = await api.post(`/cakes/${cakeId}/sizes`, {
        label:  newRow.label.trim(),
        slices: parseInt(newRow.slices, 10),
        price:  parseFloat(newRow.price),
      });
      onChange([...sizes, data]);
      setNewRow({ label: '', slices: '', price: '' });
      setAddOpen(false);
    } catch {
      setError('Failed to add size.');
    } finally {
      setAddSaving(false);
    }
  }

  function cancelAdd() {
    setAddOpen(false);
    setNewRow({ label: '', slices: '', price: '' });
    setError('');
  }

  return (
    <div className="bg-white rounded-2xl border border-stroke overflow-hidden">
      <div className="px-5 py-4 border-b border-stroke flex items-center justify-between">
        <h2 className="font-heading text-base text-brown">Sizes</h2>
        {!addOpen && (
          <button
            onClick={() => { setAddOpen(true); setError(''); }}
            className="flex items-center gap-1 text-xs font-semibold text-crimson hover:text-crimson/80 transition-colors"
          >
            <Plus size={13} />
            Add
          </button>
        )}
      </div>

      {sizes.length === 0 && !addOpen && (
        <p className="px-5 py-4 text-xs text-muted-foreground">No sizes configured.</p>
      )}

      <div className="divide-y divide-stroke">
        {sizes.map((size) => (
          <div key={size.id} className="px-5 py-3">
            {editRow?.id === size.id ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="text"
                    value={editRow.label}
                    onChange={(e) => setEditRow((r) => ({ ...r, label: e.target.value }))}
                    className={cellCls}
                    placeholder="Label"
                  />
                  <input
                    type="number"
                    value={editRow.slices}
                    onChange={(e) => setEditRow((r) => ({ ...r, slices: e.target.value }))}
                    className={cellCls}
                    placeholder="Slices"
                    min="1"
                  />
                  <input
                    type="number"
                    value={editRow.price}
                    onChange={(e) => setEditRow((r) => ({ ...r, price: e.target.value }))}
                    className={cellCls}
                    placeholder="Price"
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => { setEditRow(null); setError(''); }}
                    className="p-1.5 text-muted-foreground hover:text-brown transition-colors"
                  >
                    <X size={13} />
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={editSaving}
                    className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
                  >
                    {editSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-brown">{size.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">{size.slices} slices</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-heading text-crimson">{formatPrice(size.price)}</span>
                  <button
                    onClick={() => { setEditRow({ ...size, price: String(size.price) }); setError(''); }}
                    className="p-1 rounded text-muted-foreground hover:text-brown hover:bg-muted transition-colors"
                    aria-label="Edit size"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(size.id)}
                    disabled={deletingId === size.id}
                    className="p-1 rounded text-muted-foreground hover:text-crimson hover:bg-red-50 transition-colors"
                    aria-label="Delete size"
                  >
                    {deletingId === size.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={12} />
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {addOpen && (
          <div className="px-5 py-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-muted-foreground">New Size</p>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                value={newRow.label}
                onChange={(e) => setNewRow((r) => ({ ...r, label: e.target.value }))}
                className={cellCls}
                placeholder="Label"
              />
              <input
                type="number"
                value={newRow.slices}
                onChange={(e) => setNewRow((r) => ({ ...r, slices: e.target.value }))}
                className={cellCls}
                placeholder="Slices"
                min="1"
              />
              <input
                type="number"
                value={newRow.price}
                onChange={(e) => setNewRow((r) => ({ ...r, price: e.target.value }))}
                className={cellCls}
                placeholder="Price"
                step="0.01"
                min="0.01"
              />
            </div>
            <div className="flex gap-1 justify-end">
              <button onClick={cancelAdd} className="p-1.5 text-muted-foreground hover:text-brown transition-colors">
                <X size={13} />
              </button>
              <button
                onClick={handleAdd}
                disabled={addSaving}
                className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
              >
                {addSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="px-5 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{error}</p>
      )}
    </div>
  );
}
