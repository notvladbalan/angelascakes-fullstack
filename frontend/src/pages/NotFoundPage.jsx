import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
        <p className="font-heading text-[8rem] leading-none text-crimson select-none">404</p>
        <p className="font-heading text-2xl text-brown">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-2 h-10 px-6 rounded-xl bg-crimson text-white text-sm font-semibold flex items-center hover:bg-crimson/90 transition-colors"
        >
          Back to Catalog
        </Link>
      </div>
    </div>
  );
}
