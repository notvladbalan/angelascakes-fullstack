export const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-stroke text-sm text-brown outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson transition bg-white';

export default function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
