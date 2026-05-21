import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TagsManager from '@/components/admin/TagsManager';

export default function AdminDecorationsPage() {
  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex w-full">
        <AdminSidebar />
        <div className="flex-1 px-6 py-8">
          <TagsManager title="Decorations" apiPath="/decorations" singular="decoration" />
        </div>
      </div>
    </div>
  );
}
