import feathers from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client'
import storage from '@/utils/feathers-storage'
import axios from 'axios'

const restClient = rest(process.env.baseUrl)
const api = feathers()
  .configure(restClient.axios(axios))
  .configure(auth({ storage }))

export const service = async (store, method, ...options) => {
  const [serv, type] = method.split('/')
  store.dispatch('loading/start')
  let result
  try {
    result = await api.service(serv)[type](...options)
  } catch (error) {
    store.dispatch('notification/error', error.message)
  }
  store.dispatch('loading/stop')
  return result
}

export default api
