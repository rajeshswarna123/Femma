importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

var CACHE_VERSION = 'v2';

workbox.core.setCacheNameDetails({
  prefix: 'angularblueprint',
  suffix: CACHE_VERSION
});

workbox.skipWaiting();
workbox.clientsClaim();
workbox.navigationPreload.enable();

workbox.routing.registerRoute(
  /.*\.js$/,
  workbox.strategies.networkFirst({
    cacheName: 'js-cache-' + CACHE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  /.*\.css$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'css-cache-' + CACHE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 5
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  /.*(?:\.eot|\.otf|\.ttf|\.woff|\.woff2|fonts\.googleapis\.com)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'font-cache-' + CACHE_VERSION,
    matchOptions: {
      ignoreSearch: true
    },
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'image-cache-' + CACHE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('/'),
  workbox.strategies.networkFirst({
    cacheName: 'site-cache-' + CACHE_VERSION,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

