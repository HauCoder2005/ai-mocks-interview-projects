import Link from 'next/link';

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-4 text-xl font-bold border-b border-slate-700 shrink-0">
        Admin Portal
      </div>

      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded transition-colors">
          Dashboard
        </Link>
        <Link href="/cv-management" className="p-2 hover:bg-slate-800 rounded transition-colors">
          Quản lý CV
        </Link>
        <Link href="/interviews" className="p-2 hover:bg-slate-800 rounded transition-colors">
          Lịch Phỏng vấn
        </Link>
      </nav>
    </aside>
  );
};