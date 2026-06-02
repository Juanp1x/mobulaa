'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Pedido {
  id: string
  estado: string
  fecha: string
  observacion: string
  usuarios: { nombre: string }
  bodegas: { nombre: string }
  detalle_pedido: { cantidad_solicitada: number; productos: { nombre: string } }[]
}

export default function PedidosBodegueroPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const cargarPedidos = async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('*, usuarios(nombre), bodegas(nombre), detalle_pedido(cantidad_solicitada, productos(nombre))')
      .order('fecha', { ascending: false })
    setPedidos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargarPedidos() }, [])

  const cambiarEstado = async (id: string, estado: string) => {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    cargarPedidos()
  }

  const estadoColor: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    aprobado: 'bg-green-100 text-green-700',
    rechazado: 'bg-red-100 text-red-700',
    entregado: 'bg-blue-100 text-blue-700'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
      {loading ? <p>Cargando...</p> : (
        <div className="flex flex-col gap-4">
          {pedidos.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Vendedor: {p.usuarios?.nombre}</p>
                  <p className="text-sm text-gray-500">Bodega: {p.bodegas?.nombre}</p>
                  <p className="text-sm text-gray-500">{new Date(p.fecha).toLocaleDateString()}</p>
                  <div className="mt-2">
                    {p.detalle_pedido?.map((d, i) => (
                      <p key={i} className="text-sm">• {d.productos?.nombre} x{d.cantidad_solicitada}</p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 rounded text-sm capitalize ${estadoColor[p.estado]}`}>{p.estado}</span>
                  {p.estado === 'pendiente' && (
                    <div className="flex gap-2">
                      <button onClick={() => cambiarEstado(p.id, 'aprobado')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Aprobar</button>
                      <button onClick={() => cambiarEstado(p.id, 'rechazado')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Rechazar</button>
                    </div>
                  )}
                  {p.estado === 'aprobado' && (
                    <button onClick={() => cambiarEstado(p.id, 'entregado')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Marcar entregado</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}