import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'

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
    const response = await api.service('payments').find(paramsForServer(params))
    context.commit('update', response.data)
  },

  async get(context, { id, query, ...params }) {
    const response = await api.service('payments').get(id, paramsForServer({ query, ...params }))
    context.commit('updateLesson', response)
  },
}
