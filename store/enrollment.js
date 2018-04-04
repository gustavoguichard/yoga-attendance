import api from '@/api'

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
    const response = await api.service('enrollment').find(params)
    context.commit('update', response.data)
  },
  async get(context, { id, query }) {
    const response = await api.service('enrollment').get(id, { query })
    context.commit('updateEnrollment', response)
  },
  async patch(context, { _id, ...data }) {
    return api.service('enrollment').patch(_id, data)
  },
}
