'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Bodega {
  id: string
  nombre: string
  direccion: string
  tipo: 'principal' | 'secundaria'
  activo: boolean
}

export default function BodegasPage() {
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Bodega | null>(null)
  const [form, setForm] = useState({ nombre: '', direccion: '', tipo: 'secundaria' })
  const supabase = createClient()

  const cargarBodegas = async () => {
    const { data } = await supabase.from('bodegas').select('*').eq('activo', true)
    setBodegas(data || [])
    setLoading(false)
  }

  useEffect(() => { cargarBodegas() }, [])

  const handleGuardar = async () => {
    if (editando) {
      await supabase.from('bodegas').update(form).eq('id', editando.id)
    } else {
      await supabase.from('bodegas').insert({ ...form, activo: true })
    }
    setShowModal(false)
    setEditando(null)
    setForm({ nombre: '', direccion: '', tipo: 'secundaria' })
    cargarBodegas()
  }

  const handleEditar = (bodega: Bodega) => {
    setEditando(bodega)
    setForm({ nombre: bodega.nombre, direccion: bodega.direccion, tipo: bodega.tipo })
    setShowModal(true)
  }

  const handleEliminar = async (id: string) => {
    await supabase.from('bodegas').update({ activo: false }).eq('id', id)
    cargarBodegas()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bodegas</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nueva Bodega
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map(b => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.nombre}</td>
                <td className="p-3">{b.direccion}</td>
                <td className="p-3 capitalize">{b.tipo}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEditar(b)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                  <button onClick={() => handleEliminar(b.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Bodega' : 'Nueva Bodega'}</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
            <select className="w-full border p-2 rounded mb-3" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
              <option value="principal">Principal</option>
              <option value="secundaria">Secundaria</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowModal(false); setEditando(null); setForm({ nombre: '', direccion: '', tipo: 'secundaria' }) }} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleGuardar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}