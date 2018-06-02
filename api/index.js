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
  store.dispatch('ui/load')
  let result
  try {
    result = await api.service(serv)[type](...options)
  } catch (error) {
    store.dispatch('notification/error', error.message)
  }
  store.dispatch('ui/done')
  return result
}

export default api
