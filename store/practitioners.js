import api from '@/api'
import { filter, sortBy } from 'lodash'
import { groupByFirstLetter } from '@/utils/helpers'

export const state = () => ({
  list: [],
})

export const mutations = {
  update(current, data) {
    current.list = sortBy(data, 'fullName')
  },
  updatePerson(current, person) {
    current.person = person
  },
}

export const actions = {
  async find(context, params) {
    const response = await api.service('practitioners').find(params)
    context.commit('update', response.data)
  },

  async get(context, id) {
    const response = await api.service('practitioners').get(id)
    context.commit('updatePerson', response)
  },

  async patch(context, { _id, ...data }) {
    return api.service('practitioners').patch(_id, data)
  },

  async create(context, data) {
    return api.service('practitioners').create(data)
  },
}

export const getters = {
  practitionersByLetter({ list }) {
    return groupByFirstLetter(list, 'fullName')
  },
  teachers({ list }) {
    return filter(list, person => person.teacher)
  },
}
