import { STATUS_CONFIG } from '@/utils/orderStatus';

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, classes: 'bg-muted text-muted-foreground' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
