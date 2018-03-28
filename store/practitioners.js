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
}

export const actions = {
  async fetch(context) {
    const response = await api.service('practitioners').find()
    context.commit('update', response.data)
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
