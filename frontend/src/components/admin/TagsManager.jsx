import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import Field, { inputCls } from '@/components/admin/Field';
import api from '@/api/axios';

export default function TagsManager({ title, apiPath, singular }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Add modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');

  // Inline edit
  const [editId, setEditId]     = useState(null);
  const [editName, setEditName] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError]   = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(apiPath)
      .then((r) => setItems(r.data))
      .catch(() => setError(`Failed to load ${title.toLowerCase()}.`))
      .finally(() => setLoading(false));
  }, [apiPath, title]);

  function openAdd() {
    setName('');
    setFormError('');
    setModalOpen(true);
  }

  function startEdit(item) {
    setEditId(item.id);
    setEditName(item.name);
    setEditError('');
  }

  function cancelEdit() {
    setEditId(null);
    setEditError('');
  }

  async function handleAdd() {
    if (!name.trim()) { setFormError('Name is required.'); return; }
    setSaving(true);
    setFormError('');
    try {
      const { data } = await api.post(apiPath, { name: name.trim() });
      setItems((prev) => [...prev, data]);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editName.trim()) { setEditError('Name cannot be empty.'); return; }
    setEditSaving(true);
    setEditError('');
    try {
      const { data } = await api.put(`${apiPath}/${editId}`, { name: editName.trim() });
      setItems((prev) => prev.map((i) => (i.id === editId ? data : i)));
      setEditId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Save failed.');
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      await api.delete(`${apiPath}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteId(null);
    } catch {
      // silent; user can retry
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brown">{title}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-crimson text-white text-sm font-semibold hover:bg-crimson/90 transition-colors"
        >
          <Plus size={16} />
          Add {singular}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-crimson" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl border border-stroke overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">NAME</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    {editId === item.id ? (
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') cancelEdit(); }}
                          className={`${inputCls} h-8 text-sm`}
                          autoFocus
                        />
                        {editError && <p className="text-xs text-red-600">{editError}</p>}
                      </div>
                    ) : (
                      <span className="font-body text-brown">{item.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {editId === item.id ? (
                        <>
                          <button
                            onClick={handleEdit}
                            disabled={editSaving}
                            className="p-1.5 rounded-lg text-white bg-crimson hover:bg-crimson/90 transition-colors disabled:opacity-60"
                            aria-label="Save"
                          >
                            {editSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-brown hover:bg-muted transition-colors"
                            aria-label="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-brown hover:bg-muted transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-crimson hover:bg-red-50 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No {title.toLowerCase()} yet. Add one above.
            </p>
          )}
        </div>
      )}

      {modalOpen && (
        <Modal title={`Add ${singular}`} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Name *">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className={inputCls}
                placeholder={`e.g. ${singular === 'flavour' ? 'Vanilla' : singular === 'decoration' ? 'Sprinkles' : 'Birthday'}`}
                autoFocus
              />
            </Field>
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>
            )}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 h-10 rounded-xl border border-stroke text-sm text-brown hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 h-10 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 transition-colors disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : `Add ${singular}`}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={`Delete ${singular}`} onClose={() => setDeleteId(null)}>
          <p className="text-sm text-muted-foreground mb-5">
            Are you sure you want to delete this {singular}? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setDeleteId(null)} className="flex-1 h-10 rounded-xl border border-stroke text-sm text-brown hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="flex-1 h-10 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 transition-colors disabled:opacity-60">
              {deleting && <Loader2 size={14} className="animate-spin" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
