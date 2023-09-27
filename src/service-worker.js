import {
    build,
    files,
    prerendered,
    version
} from '$service-worker'
import {
    cleanupOutdatedCaches,
    precacheAndRoute
} from 'workbox-precaching'
import {
    registerRoute,
} from 'workbox-routing'
import {
    StaleWhileRevalidate,
    NetworkOnly
} from 'workbox-strategies'


const precache_list = [
    ...build,
    ...files,
    ...prerendered,
].map(s => ({
    url: s,
    revision: version
}))

// console.log(precache_list, 'precache_list')

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})
self.addEventListener("install", (event) => {
    self.skipWaiting();
});


precacheAndRoute(precache_list)

cleanupOutdatedCaches()




registerRoute(({
    url
}) => [
    '/onedevice',
    '/onedevice/profile',
    '/onedevice/kalender',
    '/onedevice/transkrip',
    '/onedevice/ktm',
    '/onedevice/hasil-studi',
    '/onedevice/pengumuman',

].includes(url.pathname), new StaleWhileRevalidate())

registerRoute(({
    url,
}) => [
    '/service/fotomhs',
    '/onedevice/histori-presensi',
    '/onedevice/pembayaran',
    '/onedevice/daak',
    '/onedevice/jadwal-kuliah'
].some(pathname => url.pathname.startsWith(pathname)), new StaleWhileRevalidate())
