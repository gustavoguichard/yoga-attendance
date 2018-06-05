import { service } from '@/api'
import { filter, sortBy } from 'lodash'

export default {
  state: () => ({
    list: [],
  }),
  mutations: {
    update(current, data) {
      current.list = sortBy(data, 'displayName')
    },
    updatePerson(current, person) {
      current.person = person
    },
  },
  actions: {
    async find(context, params) {
      const response = await service(this, 'practitioners/find', params)
      context.commit('update', response.data)
    },

    async get(context, { id, query }) {
      const response = await service(this, 'practitioners/get', id, { query })
      context.commit('updatePerson', response)
    },
  },
  getters: {
    teachers({ list }) {
      return filter(list, person => person.teacher)
    },
  },
}
