'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InventarioItem {
  id: string
  cantidad_disponible: number
  productos: { nombre: string; codigo: string; categoria: string; descripcion: string }
  bodegas: { nombre: string }
}

export default function CatalogoPage() {
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('inventario')
        .select('*, productos(nombre, codigo, categoria, descripcion), bodegas(nombre)')
        .gt('cantidad_disponible', 0)
      setInventario(data || [])
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catálogo de Productos</h1>
      {loading ? <p>Cargando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventario.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg">{item.productos?.nombre}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.productos?.codigo}</p>
              <p className="text-gray-600 text-sm mb-2">{item.productos?.descripcion}</p>
              <p className="text-sm mb-1"><span className="font-medium">Categoría:</span> {item.productos?.categoria}</p>
              <p className="text-sm mb-1"><span className="font-medium">Bodega:</span> {item.bodegas?.nombre}</p>
              <p className="text-sm"><span className="font-medium">Stock:</span> {item.cantidad_disponible}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}