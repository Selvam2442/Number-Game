const CACHE_NAME = 'number-magic-cache-v1';

// These are the files that will be downloaded for offline use.
// Make sure "logo.png" matches your actual image file name exactly.
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './logo.png' ,
  './image.png'
];

// Install Event: Downloads everything to the phone
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Caching offline assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event: Cleans up old caches if you update the game
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Serves the game from the phone's memory if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Return cached version if found, otherwise fetch from internet
            return response || fetch(event.request);
        })
    );
});
