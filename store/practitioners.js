import api from '@/api'
import { filter } from 'lodash'
import { groupByFirstLetter } from '@/utils/helpers'

export const state = () => ({
  list: [],
})

export const mutations = {
  update(current, data) {
    current.list = data
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

  async patch(context, { id, ...data }) {
    return api.service('practitioners').patch(id, data)
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
