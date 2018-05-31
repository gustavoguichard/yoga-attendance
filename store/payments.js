import api from '@/api'

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
  async find(context) {
    const response = await api.service('payments').find()
    context.commit('update', response.data)
  },

  async get(context, { id, query }) {
    const response = await api.service('payments').get(id, { query })
    context.commit('updateLesson', response)
  },
}
