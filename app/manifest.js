export default function manifest() {
  return {
    name: 'UPM Uy - Análisis de Documentos',
    short_name: 'UPM Docs',
    description: 'Aplicación para análisis y validación de documentos de seguridad',
    start_url: '/',
    display: 'standalone',
    background_color: '#202020',
    theme_color: '#008342',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
