export type Rol = 'admin' | 'bodeguero' | 'vendedor'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  bodega_id?: string
  activo: boolean
}

export interface Bodega {
  id: string
  nombre: string
  direccion: string
  tipo: 'principal' | 'secundaria'
  activo: boolean
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  codigo: string
  imagen_url?: string
  activo: boolean
}

export interface Inventario {
  id: string
  producto_id: string
  bodega_id: string
  cantidad_disponible: number
  cantidad_minima: number
}

export interface Movimiento {
  id: string
  producto_id: string
  bodega_origen_id?: string
  bodega_destino_id?: string
  cantidad: number
  tipo: 'entrada' | 'salida' | 'traslado'
  usuario_id: string
  fecha: string
  observacion?: string
}

export interface Pedido {
  id: string
  vendedor_id: string
  bodega_id: string
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'entregado'
  fecha: string
  observacion?: string
}

export interface DetallePedido {
  id: string
  pedido_id: string
  producto_id: string
  cantidad_solicitada: number
  cantidad_aprobada?: number
}