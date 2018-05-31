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
    this.dispatch('loading/start')
    const response = await api.service('enrollment').find(params)
    context.commit('update', response.data)
    this.dispatch('loading/stop')
  },
  async get(context, { id, query }) {
    this.dispatch('loading/start')
    const response = await api.service('enrollment').get(id, { query })
    context.commit('updateEnrollment', response)
    this.dispatch('loading/stop')
  },
}
