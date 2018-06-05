import { service } from '@/api'

export default {
  state: () => ({
    paymentDescriptions: [],
  }),

  mutations: {
    update(current, data) {
      current.paymentDescriptions = data
    },
    updateLesson(current, paymentDescription) {
      current.currentPayment = paymentDescription
    },
  },

  actions: {
    async find(context, params) {
      const response = await service(this, 'payments/find', params)
      context.commit('update', response.data)
    },

    async get(context, { id, query }) {
      const response = await service(this, 'payments/get', id, { query })
      context.commit('updateLesson', response)
    },
  },
}
