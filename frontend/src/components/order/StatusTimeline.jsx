import { STATUS_CONFIG } from '@/utils/orderStatus';

const STATUS_STEPS = ['PENDING', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED'];

export default function StatusTimeline({ status }) {
  const cancelled = status === 'CANCELLED';
  const currentIdx = STATUS_STEPS.indexOf(status);

  if (cancelled) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Status
        </p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />
          <span className="text-sm text-red-600 font-semibold">Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Status
      </p>
      {STATUS_STEPS.map((step, idx) => {
        const done    = idx < currentIdx;
        const current = idx === currentIdx;
        const pending = idx > currentIdx;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <span
                className={`w-3 h-3 rounded-full mt-0.5 transition-colors ${
                  done || current ? 'bg-crimson' : 'bg-stroke'
                } ${current ? 'ring-4 ring-crimson/20' : ''}`}
              />
              {idx < STATUS_STEPS.length - 1 && (
                <span className={`w-0.5 h-6 ${done ? 'bg-crimson' : 'bg-stroke'}`} />
              )}
            </div>
            <p className={`text-sm pb-1 ${
              current ? 'text-crimson font-semibold' : pending ? 'text-muted-foreground/50' : 'text-brown'
            }`}>
              {STATUS_CONFIG[step]?.label ?? step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
