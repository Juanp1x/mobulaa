'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return setError(error.message)
  
  console.log('usuario:', data.user)

  const { data: profile, error: profileError } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', data.user.id)
    .single()

  console.log('perfil:', profile)
  console.log('error perfil:', profileError)

  if (profile?.rol === 'admin') router.push('/admin')
  else if (profile?.rol === 'bodeguero') router.push('/bodeguero')
  else router.push('/vendedor')
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Mobulaa</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input className="w-full border p-2 rounded mb-4" type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded mb-4" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Ingresar</button>
        <p className="text-center mt-4 text-sm">¿No tienes cuenta? <a href="/registro" className="text-blue-600">Regístrate</a></p>
      </div>
    </div>
  )
}