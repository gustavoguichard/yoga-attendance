import { service } from '@/api'

export default {
  state: () => ({
    options: [],
  }),

  mutations: {
    update(current, data) {
      current.options = data
    },
    updateEnrollment(current, currentEnrollment) {
      current.currentEnrollment = currentEnrollment
    },
  },

  actions: {
    async find(context, params) {
      const response = await service(this, 'enrollment/find', params)
      context.commit('update', response.data)
    },
    async get(context, { id, query }) {
      const response = await service(this, 'enrollment/get', id, { query })
      context.commit('updateEnrollment', response)
    },
  },
}
