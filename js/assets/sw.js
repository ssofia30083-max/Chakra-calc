const CACHE_NAME = 'chakra-calculator-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/style.css',
    '/styles/responsive.css',
    '/js/utils.js',
    '/js/calculator.js',
    '/js/fileReader.js',
    '/js/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});