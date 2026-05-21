import { Cake, Package, ShieldCheck, Layers, Sparkles, Tag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

const NAV_GROUPS = [
  {
    items: [
      { label: 'Orders', icon: Package, path: '/admin/orders' },
      { label: 'Cakes',  icon: Cake,    path: '/admin/cakes'  },
    ],
  },
  {
    heading: 'Catalog',
    items: [
      { label: 'Cake Types',   icon: Layers,   path: '/admin/cake-types'   },
      { label: 'Flavours',     icon: Sparkles, path: '/admin/flavors'      },
      { label: 'Decorations',  icon: Tag,      path: '/admin/decorations'  },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <Sidebar className="flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-6 border-b border-stroke">
        <div className="w-12 h-12 rounded-full bg-crimson/10 flex items-center justify-center mb-3">
          <ShieldCheck size={22} className="text-crimson" />
        </div>
        <p className="font-heading text-[1.05rem] text-brown leading-snug">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-4 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.heading && (
              <p className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                {group.heading}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                      isActive
                        ? 'bg-muted text-crimson font-semibold'
                        : 'text-brown hover:bg-muted'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </Sidebar>
  );
}
