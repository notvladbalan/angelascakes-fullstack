import Navbar from '@/components/layout/Navbar';
import CustomerSidebar from '@/components/layout/CustomerSidebar';
import ProfileCard from '@/components/customer/ProfileCard';
import DeliveryAddressCard from '@/components/customer/DeliveryAddressCard';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        <CustomerSidebar />

        <main className="flex-1 px-8 py-8 min-w-0">
          <h1 className="font-heading text-2xl text-brown mb-6">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ProfileCard />
            <DeliveryAddressCard />
          </div>
        </main>
      </div>
    </div>
  );
}
