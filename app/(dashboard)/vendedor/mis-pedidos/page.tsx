'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Pedido {
  id: string
  estado: string
  fecha: string
  observacion: string
  bodegas: { nombre: string }
}

interface Producto { id: string; nombre: string }
interface Bodega { id: string; nombre: string }

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ bodega_id: '', observacion: '', items: [{ producto_id: '', cantidad: '' }] })
  const supabase = createClient()

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: p } = await supabase.from('pedidos').select('*, bodegas(nombre)').eq('vendedor_id', user?.id).order('fecha', { ascending: false })
    const { data: prod } = await supabase.from('productos').select('id, nombre').eq('activo', true)
    const { data: b } = await supabase.from('bodegas').select('id, nombre').eq('activo', true)
    setPedidos(p || [])
    setProductos(prod || [])
    setBodegas(b || [])
    setLoading(false)
  }

  useEffect(() => { cargarDatos() }, [])

  const handleGuardar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: pedido } = await supabase.from('pedidos').insert({
      vendedor_id: user?.id,
      bodega_id: form.bodega_id,
      observacion: form.observacion,
      estado: 'pendiente',
      fecha: new Date().toISOString()
    }).select().single()

    if (pedido) {
      await supabase.from('detalle_pedido').insert(
        form.items.map(item => ({
          pedido_id: pedido.id,
          producto_id: item.producto_id,
          cantidad_solicitada: parseInt(item.cantidad)
        }))
      )
    }

    setShowModal(false)
    setForm({ bodega_id: '', observacion: '', items: [{ producto_id: '', cantidad: '' }] })
    cargarDatos()
  }

  const agregarItem = () => setForm({...form, items: [...form.items, { producto_id: '', cantidad: '' }]})

  const estadoColor: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    aprobado: 'bg-green-100 text-green-700',
    rechazado: 'bg-red-100 text-red-700',
    entregado: 'bg-blue-100 text-blue-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Pedidos</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo Pedido</button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <div className="flex flex-col gap-4">
          {pedidos.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Bodega: {p.bodegas?.nombre}</p>
                  <p className="text-sm text-gray-500">{new Date(p.fecha).toLocaleDateString()}</p>
                  {p.observacion && <p className="text-sm mt-1">{p.observacion}</p>}
                </div>
                <span className={`px-3 py-1 rounded text-sm capitalize ${estadoColor[p.estado]}`}>{p.estado}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nuevo Pedido</h2>
            <select className="w-full border p-2 rounded mb-3" value={form.bodega_id} onChange={e => setForm({...form, bodega_id: e.target.value})}>
              <option value="">Seleccionar bodega</option>
              {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
            <input className="w-full border p-2 rounded mb-3" placeholder="Observación" value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
            <p className="font-medium mb-2">Productos:</p>
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select className="flex-1 border p-2 rounded" value={item.producto_id} onChange={e => { const items = [...form.items]; items[i].producto_id = e.target.value; setForm({...form, items}) }}>
                  <option value="">Producto</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
                <input className="w-20 border p-2 rounded" type="number" placeholder="Cant." value={item.cantidad} onChange={e => { const items = [...form.items]; items[i].cantidad = e.target.value; setForm({...form, items}) }} />
              </div>
            ))}
            <button onClick={agregarItem} className="text-blue-600 text-sm mb-4">+ Agregar producto</button>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleGuardar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}