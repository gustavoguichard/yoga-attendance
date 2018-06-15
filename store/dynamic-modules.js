import Vue from 'vue'
import feathersVuex from 'feathers-vuex'
import api from '@/api'
import { get, map, reduce } from 'lodash'

const { service, FeathersVuex } = feathersVuex(api, {
  idField: '_id',
  enableEvents: false,
})

Vue.use(FeathersVuex)

const servicesFiles = require.context('./services', false, /.js$/)
const modulesFiles = require.context('./modules', false, /.js$/)

// getNameFromPath :: String -> String
// getNameFromPath('./name.js') -> 'name'
const getNameFromPath = path => path.replace(/^.*[\\/]/, '').split('.')[0]

const setLoader = (action, { dispatch }) => hook => {
  dispatch(`ui/${action}`)
  return hook
}

export const servicePlugins = () => map(servicesFiles.keys(), path => {
  const name = getNameFromPath(path)
  const { hooks, store } = servicesFiles(path)
  const fn = (rootStore, ...args) => {
    api.service(name).hooks({
      before: { ...hooks.before, all: [setLoader('load', rootStore)].concat(get(hooks, 'before.all', [])) },
      after: { ...hooks.after, all: [setLoader('done', rootStore)].concat(get(hooks, 'after.all', [])) },
      error: {
        ...hooks.error,
        all: [hook => {
          if (hook.error.message === 'Network Error') {
            rootStore.dispatch('notification/offline')
          } else {
            rootStore.dispatch('notification/error', hook.error.message)
          }
          rootStore.dispatch('ui/done')
          return hook
        }].concat(get(hooks, 'error.all', [])),
      },
    })
    return service(name, store)(rootStore, ...args)
  }
  return fn
})

export const modules = reduce(modulesFiles.keys(), (curr, path) => {
  curr[getNameFromPath(path)] = { namespaced: true, ...modulesFiles(path).default }
  return curr
}, {})
