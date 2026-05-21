import useAuthStore from "@/store/authStore";
import { LayoutDashboard, LogOut, Package, Settings, Star } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    enabled: true,
  },
  { label: "My Orders", icon: Package, path: "/orders", enabled: true },
  { label: "Favourites", icon: Star, path: "/favourites", enabled: false },
  { label: "Settings", icon: Settings, path: "/settings", enabled: true },
];

export default function CustomerSidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "My Account";

  const initial = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Sidebar className="flex flex-col min-h-0">
      {/* User card */}
      <div className="px-5 py-6 border-b border-stroke">
        <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center mb-3">
          <span className="font-heading text-xl text-crimson leading-none">
            {initial}
          </span>
        </div>
        <p className="font-heading text-[1.05rem] text-brown leading-snug wrap-break-word">
          {displayName}
        </p>
        {user?.email && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {user.email}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, path, enabled }) =>
          enabled ? (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive
                    ? "bg-muted text-crimson font-semibold"
                    : "text-brown hover:bg-muted"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ) : (
            <div
              key={path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-brown/30 cursor-not-allowed select-none"
            >
              <Icon size={18} />
              {label}
              <span className="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full leading-none">
                Soon
              </span>
            </div>
          ),
        )}
      </nav>

      {/* Log Out */}
      <div className="px-3 pb-5 pt-3 border-t border-stroke">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body bg-crimson text-white hover:bg-crimson/90 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </Sidebar>
  );
}
