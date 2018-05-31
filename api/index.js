import feathers from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client'
import storage from '@/utils/feathers-storage'
import axios from 'axios'

const restClient = rest(process.env.baseUrl)
const api = feathers()
  .configure(restClient.axios(axios))
  .configure(auth({ storage }))

export async function service(store, method, ...options) {
  const [serv, type] = method.split('/')
  await api.service(serv)[type](...options)
}

export default api
