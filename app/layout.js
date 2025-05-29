import { Inter } from 'next/font/google'
import './globals.css'
import RegisterSW from './register-sw'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UPM Uy - Análisis de Documentos',
  description: 'Aplicación para análisis y validación de documentos de seguridad',
  manifest: '/manifest.json',
  themeColor: '#008342',
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#008342" />
      </head>
      <body className={inter.className}>
        {children}
        <RegisterSW />
      </body>
    </html>
  )
}
