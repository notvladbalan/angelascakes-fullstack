import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, className = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className={`bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stroke">
          <h2 className="font-heading text-lg text-brown">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-brown hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
