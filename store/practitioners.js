import api from '@/api'
import { filter, sortBy } from 'lodash'

export const state = () => ({
  list: [],
})

export const mutations = {
  update(current, data) {
    current.list = sortBy(data, 'displayName')
  },
  updatePerson(current, person) {
    current.person = person
  },
}

export const actions = {
  async find(context, params) {
    this.dispatch('loading/start')
    const response = await api.service('practitioners').find(params)
    context.commit('update', response.data)
    this.dispatch('loading/stop')
  },

  async get(context, { id, query }) {
    this.dispatch('loading/start')
    const response = await api.service('practitioners').get(id, { query })
    context.commit('updatePerson', response)
    this.dispatch('loading/stop')
  },
}

export const getters = {
  teachers({ list }) {
    return filter(list, person => person.teacher)
  },
}
