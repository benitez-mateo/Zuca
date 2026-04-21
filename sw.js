const CACHE = 'zuca-v1'

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

// Fetch: responder desde caché si está disponible, si no ir a la red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => caches.match('./Lista_zuca.html'))
    })
  )
})
