export default function Sidebar({ children, className = '' }) {
  return (
    <aside className={`w-64 shrink-0 bg-white border-r border-stroke sticky top-16 h-[calc(100vh-4rem)] ${className}`}>
      {children}
    </aside>
  );
}
