importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "yoga-attendance",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.1d44bf79a7a8da00c3e4.js",
    "revision": "8b17da8468f6b6c3492efdac0f6fe01f"
  },
  {
    "url": "/_nuxt/app.528463e8500da0c9390434004946bc84.css",
    "revision": "528463e8500da0c9390434004946bc84"
  },
  {
    "url": "/_nuxt/layouts/default.616192576d49bf0ebf5c.js",
    "revision": "82f68278859410a0ae6fc37b50ca1121"
  },
  {
    "url": "/_nuxt/manifest.dfa3191342284b00743c.js",
    "revision": "0a72fe085f83c9e52df2b8efeea9e8d0"
  },
  {
    "url": "/_nuxt/pages/acertos/_id/edit.12370f7a2480400dcaa9.js",
    "revision": "9c94528d3bc8a55747166d7e32ff6b06"
  },
  {
    "url": "/_nuxt/pages/aulas/_id/edit.94d690aec70fb8dd9f7a.js",
    "revision": "83f8f435fa67d1f6184cf4278349f170"
  },
  {
    "url": "/_nuxt/pages/aulas/new.e620c821d2fe8a945de1.js",
    "revision": "f958536233783e8247874943d7e11fb8"
  },
  {
    "url": "/_nuxt/pages/chamada/_id.5dfcf8ffad5c0a6c6cff.js",
    "revision": "168c4a0dccc0b3ca7e143efc7d912588"
  },
  {
    "url": "/_nuxt/pages/index.25ca3a205278929811e6.js",
    "revision": "66b3c16cb31953d7ed763e93dde50ca7"
  },
  {
    "url": "/_nuxt/pages/matriculas/_id/edit.afb6e546c86602bcc633.js",
    "revision": "5c22c273f0def3f615f7963475a12139"
  },
  {
    "url": "/_nuxt/pages/matriculas/index.c57acf16892c028fbe53.js",
    "revision": "175973f9006b14677b7d854be4ffcebd"
  },
  {
    "url": "/_nuxt/pages/matriculas/new.d1453d74938c1248c663.js",
    "revision": "3088556b6162493ff99cd99c290660ec"
  },
  {
    "url": "/_nuxt/pages/praticantes/_id/edit.8c77ffa7fafc5f133e20.js",
    "revision": "1f9578181db5e28149f226618971a359"
  },
  {
    "url": "/_nuxt/pages/praticantes/_id/index.18703615bb2ae5061067.js",
    "revision": "9c9bd96f64e4bee8eebd5a5d48722c01"
  },
  {
    "url": "/_nuxt/pages/praticantes/index.dedc527c7737fae4d865.js",
    "revision": "3be2781429ec72ecce46d62372259847"
  },
  {
    "url": "/_nuxt/pages/praticantes/new.e3eb0820ba898a17c7bd.js",
    "revision": "995f69f988a40abca86a97b1eff95f00"
  },
  {
    "url": "/_nuxt/pages/presencas/_id/_date.9270aaefaded5c1f6f93.js",
    "revision": "f86892b0d84dc7969914d2ac08bbfb0f"
  },
  {
    "url": "/_nuxt/pages/presencas/index.b358ed6c4a98309071ff.js",
    "revision": "95337ddf9601b05d102371c48ab949c2"
  },
  {
    "url": "/_nuxt/pages/professores/index.9a82cd26e37cceb7edcf.js",
    "revision": "06c42d4f8fd516fad6f770a7d2041f75"
  },
  {
    "url": "/_nuxt/pages/sign-in.7ac49456c25787588d54.js",
    "revision": "04783168fd8acf61df68e74847536f58"
  },
  {
    "url": "/_nuxt/pages/sign-out.2fa418aa325445754058.js",
    "revision": "0db4e2b41d1be92ec02626c2c3c29808"
  },
  {
    "url": "/_nuxt/vendor.10215a272f150e7d1bab02871927ccb0.css",
    "revision": "10215a272f150e7d1bab02871927ccb0"
  },
  {
    "url": "/_nuxt/vendor.327b0d34583036b5e374.js",
    "revision": "5eecd2babd6872b40143f46671947f50"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp(''), workboxSW.strategies.networkFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('https://fonts.googleapis.com//.*'), workboxSW.strategies.cacheFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workboxSW.router.registerRoute(new RegExp('https://fonts.gstatic.com//.*'), workboxSW.strategies.cacheFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

