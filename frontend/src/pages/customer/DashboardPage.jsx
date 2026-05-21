import { Link } from 'react-router-dom';
import { Package, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CustomerSidebar from '@/components/layout/CustomerSidebar';
import useAuthStore from '@/store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'there';

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <CustomerSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">
          <h1 className="font-heading text-2xl text-brown mb-1">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            What would you like to do today?
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="flex items-center gap-4 bg-white rounded-2xl border border-stroke p-5 hover:shadow-md transition-shadow group flex-1"
            >
              <div className="w-11 h-11 rounded-xl bg-peach flex items-center justify-center shrink-0">
                <Package size={20} className="text-crimson" />
              </div>
              <div>
                <p className="font-heading text-base text-brown">My Orders</p>
                <p className="text-xs text-muted-foreground mt-0.5">Track and view your past orders</p>
              </div>
              <span className="ml-auto text-muted-foreground group-hover:text-brown transition-colors text-sm">→</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-4 bg-white rounded-2xl border border-stroke p-5 hover:shadow-md transition-shadow group flex-1"
            >
              <div className="w-11 h-11 rounded-xl bg-peach flex items-center justify-center shrink-0">
                <Settings size={20} className="text-crimson" />
              </div>
              <div>
                <p className="font-heading text-base text-brown">Settings</p>
                <p className="text-xs text-muted-foreground mt-0.5">Update your profile and delivery address</p>
              </div>
              <span className="ml-auto text-muted-foreground group-hover:text-brown transition-colors text-sm">→</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
