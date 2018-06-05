import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import cookieparser from 'cookieparser'
import api from '@/api'
import { reduce } from 'lodash'

const { service } = feathersVuex(api, { idField: '_id' })

const services = require.context('./services', false, /.js$/)
const servicePlugins = function () {
  return services.keys().map(path => {
    const { name, hooks, store } = services(path)
    api.service(name).hooks(hooks)
    return service(name, store)
  })
}

const modulesFiles = require.context('./modules', false, /.js$/)
const modules = reduce(modulesFiles.keys(), (curr, path) => {
  curr[path.replace(/^.*[\\/]/, '').split('.')[0]] = { namespaced: true, ...modulesFiles(path).default }
  return curr
}, {})

export default function () {
  return new Vuex.Store({
    state: () => ({}),
    getters: {},
    actions: {
      async nuxtServerInit({ dispatch }, { req }) {
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          const accessToken = parsed['feathers-jwt']
          if (accessToken) {
            try {
              const data = await api.authenticate({ strategy: 'jwt', accessToken })
              const { userId } = await api.passport.verifyJWT(data.accessToken)
              const user = await api.service('users').get(userId)
              dispatch('auth/updateUserData', { ...data, ...user })
            } catch (error) { return error }
          }
        }
        return null
      },
    },
    modules,
    plugins: [
      ...servicePlugins(),
    ],
  })
}
