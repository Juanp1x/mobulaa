import './globals.css'

export const metadata = {
  title: 'Mobulaa',
  description: 'Gestión de inventarios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}