import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'
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
    const response = await api.service('practitioners').find(paramsForServer(params))
    context.commit('update', response.data)
  },

  async get(context, { id, query, ...params }) {
    const response = await api.service('practitioners').get(id, paramsForServer({ query, ...params }))
    context.commit('updatePerson', response)
  },
}

export const getters = {
  teachers({ list }) {
    return filter(list, person => person.teacher)
  },
}
