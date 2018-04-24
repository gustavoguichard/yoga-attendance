import api from '@/api'

export const state = () => ({
  paymentDescriptions: [],
})

export const mutations = {
  update(current, data) {
    current.paymentDescriptions = data
  },
  updateLesson(current, paymentDescription) {
    current.currentDescription = paymentDescription
  },
}

export const actions = {
  async find(context, params) {
    const response = await api.service('payments').find(params)
    context.commit('update', response.data)
  },

  async get(context, { id, query }) {
    const response = await api.service('payment-description').get(id, { query })
    context.commit('updateLesson', response)
  },
}