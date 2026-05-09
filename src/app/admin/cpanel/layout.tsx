export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold mb-6">RBMPS Admin</h1>

        <nav className="space-y-2 text-sm">
          <a href="/admin/cpanel/dashboard" className="block">Dashboard</a>
          <a href="/admin/cpanel/sections" className="block">Sections</a>
          <a href="/admin/cpanel/bridges" className="block">Bridges</a>
          <a href="/admin/cpanel/elements" className="block">Elements</a>
          <a href="/admin/cpanel/users" className="block">Users</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}