const CACHE = 'zuca-v2'

const ARCHIVOS = [
  './Lista_zuca.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Pacifico&display=swap'
]

// Instalación: guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  )
  self.skipWaiting()
})

// Activación: limpiar cachés viejas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: primero intenta la red, si falla usa la caché
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Guardar copia actualizada en caché
        let copia = response.clone()
        caches.open(CACHE).then(cache => cache.put(e.request, copia))
        return response
      })
      .catch(() => {
        // Sin internet: usar la caché
        return caches.match(e.request).then(cached => cached || caches.match('./Lista_zuca.html'))
      })
  )
})
