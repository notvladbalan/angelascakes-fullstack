export const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     classes: 'bg-amber-100 text-amber-700' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-blue-100 text-blue-700'   },
  SHIPPED:     { label: 'Shipped',     classes: 'bg-teal/15 text-teal'        },
  DELIVERED:   { label: 'Delivered',   classes: 'bg-green-100 text-green-700' },
  CANCELLED:   { label: 'Cancelled',   classes: 'bg-red-100 text-red-600'     },
};

export const ORDER_STATUSES = ['PENDING', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
