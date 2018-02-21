module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Element43 - Free and Open Data for EVE Online',
    titleTemplate: '%s | Element43 | EVE Online',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#f7a53d' },
      { hid: 'description', name: 'description', content: 'More bang for the buck! Welcome to element43, a free tool providing you with all the information you need to get the most out of your hard-earned ISK. Best of all: it\'s completely free! - Get started now!' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },
  /*
  ** Caching
  */
  modules: [
    ['@nuxtjs/component-cache', { max: 1000, maxAge: 1000 * 60 * 24 }],
    '~/modules/typescript'
  ],
  /*
  ** Global CSS
  */
  css: ['assets/styles/fonts.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#f7a53d',
    height: '3px'
  },
  /*
  ** VueJS Plugins
  */
  plugins: [
    '~/plugins/vue-plugins'
  ],
  /*
  ** Routing
  */
  router: {
    middleware: 'legacyRedirect'
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['accounting',
      'highcharts',
      'highcharts/highstock',
      'highcharts/highcharts-more',
      'nuxt-class-component',
      'moment',
      'lodash',
      'slugify'],
    /*
    ** Run linters on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        // eslint
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })

        // tslint
        config.module.rules.push({
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: /(node_modules)/,
          options: {
            configFile: 'tslint.json'
          }
        })
      }

      // Load images
      if (!config.module.loaders) {
        config.module.loaders = []
      }

      config.module.loaders.push({
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      })

      config.module.loaders.push({
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      })
    }
  }
}
