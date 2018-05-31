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
  async find(context, params) {
    this.dispatch('loading/start')
    const response = await api.service('payments').find(params)
    context.commit('update', response.data)
    this.dispatch('loading/stop')
  },

  async get(context, { id, query }) {
    this.dispatch('loading/start')
    const response = await api.service('payments').get(id, { query })
    context.commit('updateLesson', response)
    this.dispatch('loading/stop')
  },
}
