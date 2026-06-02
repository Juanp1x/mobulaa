'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  codigo: string
  activo: boolean
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', codigo: '' })
  const supabase = createClient()

  const cargarProductos = async () => {
    const { data } = await supabase.from('productos').select('*').eq('activo', true)
    setProductos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargarProductos() }, [])

  const handleGuardar = async () => {
    if (editando) {
      await supabase.from('productos').update(form).eq('id', editando.id)
    } else {
      await supabase.from('productos').insert({ ...form, activo: true })
    }
    setShowModal(false)
    setEditando(null)
    setForm({ nombre: '', descripcion: '', categoria: '', codigo: '' })
    cargarProductos()
  }

  const handleEditar = (producto: Producto) => {
    setEditando(producto)
    setForm({ nombre: producto.nombre, descripcion: producto.descripcion, categoria: producto.categoria, codigo: producto.codigo })
    setShowModal(true)
  }

  const handleEliminar = async (id: string) => {
    await supabase.from('productos').update({ activo: false }).eq('id', id)
    cargarProductos()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Producto
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.codigo}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3">{p.descripcion}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEditar(p)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                  <button onClick={() => handleEliminar(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="Código" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowModal(false); setEditando(null); setForm({ nombre: '', descripcion: '', categoria: '', codigo: '' }) }} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleGuardar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}