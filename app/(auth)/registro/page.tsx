'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegistro = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return setError(error.message)

    await supabase.from('usuarios').insert({
      id: data.user?.id,
      nombre,
      email,
      rol: 'vendedor'
    })

    router.push('/vendedor')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input className="w-full border p-2 rounded mb-4" type="text" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input className="w-full border p-2 rounded mb-4" type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded mb-4" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegistro} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Registrarse</button>
        <p className="text-center mt-4 text-sm">¿Ya tienes cuenta? <a href="/login" className="text-blue-600">Inicia sesión</a></p>
      </div>
    </div>
  )
}