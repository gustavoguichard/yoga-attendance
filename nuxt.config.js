const nodeExternals = require('webpack-node-externals')
const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
  env: {
    baseUrl: process.env.REST_API || 'http://localhost:3030',
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Yoga Attendance',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Attendance management for a Yoga school - CIYF' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '128x128', href: '/touch.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    ]
  },
  plugins: ['@/plugins/vuetify.js'],
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
