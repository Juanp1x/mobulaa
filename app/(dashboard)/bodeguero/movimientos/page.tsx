'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Producto { id: string; nombre: string; codigo: string }
interface Bodega { id: string; nombre: string }
interface Movimiento {
  id: string
  cantidad: number
  tipo: string
  fecha: string
  observacion: string
  productos: { nombre: string }
  bodegas_bodega_origen_id_fkey: { nombre: string }
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ producto_id: '', bodega_origen_id: '', bodega_destino_id: '', cantidad: '', tipo: 'entrada', observacion: '' })
  const supabase = createClient()

  const cargarDatos = async () => {
    const { data: m } = await supabase.from('movimientos').select('*, productos(nombre), bodegas_bodega_origen_id_fkey:bodegas!bodega_origen_id(nombre)').order('fecha', { ascending: false })
    const { data: p } = await supabase.from('productos').select('id, nombre, codigo').eq('activo', true)
    const { data: b } = await supabase.from('bodegas').select('id, nombre').eq('activo', true)
    setMovimientos(m || [])
    setProductos(p || [])
    setBodegas(b || [])
    setLoading(false)
  }

  useEffect(() => { cargarDatos() }, [])

  const handleGuardar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('movimientos').insert({
      ...form,
      cantidad: parseInt(form.cantidad),
      usuario_id: user?.id,
      fecha: new Date().toISOString()
    })
    setShowModal(false)
    setForm({ producto_id: '', bodega_origen_id: '', bodega_destino_id: '', cantidad: '', tipo: 'entrada', observacion: '' })
    cargarDatos()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo Movimiento</button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Bodega Origen</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Observación</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.productos?.nombre}</td>
                <td className="p-3 capitalize">{m.tipo}</td>
                <td className="p-3">{m.cantidad}</td>
                <td className="p-3">{m.bodegas_bodega_origen_id_fkey?.nombre || '-'}</td>
                <td className="p-3">{new Date(m.fecha).toLocaleDateString()}</td>
                <td className="p-3">{m.observacion || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nuevo Movimiento</h2>
            <select className="w-full border p-2 rounded mb-3" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="traslado">Traslado</option>
            </select>
            <select className="w-full border p-2 rounded mb-3" value={form.producto_id} onChange={e => setForm({...form, producto_id: e.target.value})}>
              <option value="">Seleccionar producto</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <select className="w-full border p-2 rounded mb-3" value={form.bodega_origen_id} onChange={e => setForm({...form, bodega_origen_id: e.target.value})}>
              <option value="">Bodega origen</option>
              {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
            {form.tipo === 'traslado' && (
              <select className="w-full border p-2 rounded mb-3" value={form.bodega_destino_id} onChange={e => setForm({...form, bodega_destino_id: e.target.value})}>
                <option value="">Bodega destino</option>
                {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
            )}
            <input className="w-full border p-2 rounded mb-3" type="number" placeholder="Cantidad" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Observación" value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
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