'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InventarioItem {
  id: string
  cantidad_disponible: number
  cantidad_minima: number
  productos: { nombre: string; codigo: string; categoria: string }
  bodegas: { nombre: string }
}

export default function InventarioPage() {
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('inventario')
        .select('*, productos(nombre, codigo, categoria), bodegas(nombre)')
      setInventario(data || [])
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventario</h1>
      {loading ? <p>Cargando...</p> : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Bodega</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Stock Mínimo</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.productos?.codigo}</td>
                <td className="p-3">{item.productos?.nombre}</td>
                <td className="p-3">{item.productos?.categoria}</td>
                <td className="p-3">{item.bodegas?.nombre}</td>
                <td className="p-3">{item.cantidad_disponible}</td>
                <td className="p-3">{item.cantidad_minima}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${item.cantidad_disponible <= item.cantidad_minima ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.cantidad_disponible <= item.cantidad_minima ? 'Stock bajo' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}