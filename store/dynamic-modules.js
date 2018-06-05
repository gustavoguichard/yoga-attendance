import feathersVuex from 'feathers-vuex'
import api from '@/api'
import { map, reduce } from 'lodash'

const { service } = feathersVuex(api, { idField: '_id' })

const servicesFiles = require.context('./services', false, /.js$/)
const modulesFiles = require.context('./modules', false, /.js$/)

// getNameFromPath :: String -> String
// getNameFromPath('./name.js') -> 'name'
const getNameFromPath = path => path.replace(/^.*[\\/]/, '').split('.')[0]

export const servicePlugins = () => map(servicesFiles.keys(), path => {
  const name = getNameFromPath(path)
  const { hooks, store } = servicesFiles(path)
  api.service(name).hooks(hooks)
  return service(name, store)
})
// .concat(auth({
//   state: {
//     publicPages: ['/sign-in'],
//   },
//   mutations: {
//     clear(state) {
//       Vue.set(state, 'payload', null)
//       Vue.set(state, 'accessToken', null)
//       // state.accessToken = null
//     },
//   },
//   actions: {
//     async logout({ commit, dispatch }) {
//       await api.logout()
//       commit('clear')
//       dispatch('notification/info', 'Até logo!', { root: true })
//     },
//   },
// }))

export const modules = reduce(modulesFiles.keys(), (curr, path) => {
  curr[getNameFromPath(path)] = { namespaced: true, ...modulesFiles(path).default }
  return curr
}, {})
