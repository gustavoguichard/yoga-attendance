import { service } from '@/api'

export const state = () => ({
  paymentDescriptions: [],
})

export const mutations = {
  update(current, data) {
    current.paymentDescriptions = data
  },
  updateLesson(current, paymentDescription) {
    current.currentPayment = paymentDescription
  },
}

export const actions = {
  async find(context, params) {
    const response = await service(this, 'payments/find', params)
    context.commit('update', response.data)
  },

  async get(context, { id, query }) {
    const response = await service(this, 'payments/get', id, { query })
    context.commit('updateLesson', response)
  },
}
