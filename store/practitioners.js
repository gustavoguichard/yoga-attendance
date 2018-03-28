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
  async fetch(context, params) {
    const response = await api.service('practitioners').find(params)
    context.commit('update', response.data)
  },

  async find(context, id) {
    const response = await api.service('practitioners').get(id)
    context.commit('updatePerson', response)
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
