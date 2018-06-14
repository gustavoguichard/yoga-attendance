const nodeExternals = require('webpack-node-externals')
const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
  env: {
    baseUrl: process.env.REST_API || 'http://localhost:3030',
  },
  router: {
    middleware: ['auth'],
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'CIYF - Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'apple-mobile-web-app-title', content: 'CIYF' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { hid: 'description', name: 'description', content: 'Gerenciamento de presenças e pagamentos para uma escola de Yoga - CIYF' }
    ],
    link: [
      // { rel: 'manifest', type: 'application/manifest+json', href: '/manifest.json' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/icon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    ]
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: '/_nuxt/.*',
        handler: 'cacheFirst',
        method: 'GET'
      },
      {
        urlPattern: 'https://yoga-attendance-api.herokuapp.com/.*',
        handler: 'networkFirst',
        method: 'GET'
      },
      {
        urlPattern: 'https://fonts.googleapis.com//.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {cacheableResponse: {statuses: [0, 200]}},
      }, {
        urlPattern: 'https://fonts.gstatic.com//.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {cacheableResponse: {statuses: [0, 200]}},
      },
    ]
  },
  manifest: {
    name: 'Centro Iyengar Yoga Florianópolis',
    short_name: 'CIYF',
    start_url: '/',
    display: 'fullscreen',
    lang: 'pt-BR',
    background_color: '#424242',
    theme_color: '#424242',
    description: 'Gerenciamento do Centro Iyengar Yoga Florianópolis',
  },
  icon: {
    sizes: [16, 48, 72, 96, 120, 144, 152, 168, 192, 384, 512],
  },
  plugins: ['@/plugins/vuetify.js', { src: '@/plugins/localStorage.js', ssr: false }],
  css: [
    '@/assets/style/app.styl'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: {
    color: '#a48453',
    height: '15px',
  },
  /*
  ** Build configuration
  */
  modules: ['@nuxtjs/pwa'],
  build: {
    babel: {
      plugins: [
        ["transform-imports", {
          "vuetify": {
            "transform": "vuetify/es5/components/${member}",
            "preventFullImport": true
          }
        }]
      ]
    },
    vendor: [
      '@/plugins/vuetify.js',
      '@feathersjs/feathers',
      '@feathersjs/rest-client',
      'axios',
      '@feathersjs/authentication-client',
    ],
    extractCSS: true,
    cssSourceMap: false, // Disabling to avoid huge output in console
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
