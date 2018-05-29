import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'

export const state = () => ({
  options: [],
})

export const mutations = {
  update(current, data) {
    current.options = data
  },
  updateEnrollment(current, currentEnrollment) {
    current.currentEnrollment = currentEnrollment
  },
}

export const actions = {
  async find(context, params) {
    const response = await api.service('enrollment').find(paramsForServer(params))
    context.commit('update', response.data)
  },
  async get(context, { id, query, ...params }) {
    const response = await api.service('enrollment').get(id, paramsForServer({ query, ...params }))
    context.commit('updateEnrollment', response)
  },
}
