export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">Mobulaa</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin" className="p-2 rounded hover:bg-gray-700">Dashboard</a>
          <a href="/admin/productos" className="p-2 rounded hover:bg-gray-700">Productos</a>
          <a href="/admin/bodegas" className="p-2 rounded hover:bg-gray-700">Bodegas</a>
          <a href="/admin/usuarios" className="p-2 rounded hover:bg-gray-700">Usuarios</a>
          <a href="/admin/reportes" className="p-2 rounded hover:bg-gray-700">Reportes</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}