'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isBodeguero = pathname.startsWith('/bodeguero')

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">Mobulaa</h2>
        <nav className="flex flex-col gap-2">
          {/* Admin links */}
          <Link href="/admin" className="p-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link href="/admin/productos" className="p-2 rounded hover:bg-gray-700">Productos</Link>
          <Link href="/admin/bodegas" className="p-2 rounded hover:bg-gray-700">Bodegas</Link>
          <Link href="/admin/usuarios" className="p-2 rounded hover:bg-gray-700">Usuarios</Link>
          <Link href="/bodeguero/inventario" className="p-2 rounded hover:bg-gray-700">Inventario</Link>
          <Link href="/bodeguero/movimientos" className="p-2 rounded hover:bg-gray-700">Movimientos</Link>
          <Link href="/bodeguero/pedidos" className="p-2 rounded hover:bg-gray-700">Pedidos</Link>
          <Link href="/admin/reportes" className="p-2 rounded hover:bg-gray-700">Reportes</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}