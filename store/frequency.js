import api from '@/api'
import { flatten, groupBy, map } from 'lodash'

const PAGE_LIMIT = 20

export const state = () => ({
  result: [],
})

export const mutations = {
  update(current, data) {
    current.result = data
  },
}

export const actions = {
  async find(context, { page, query }) {
    const pagination = page ? {
      $limit: PAGE_LIMIT,
      $skip: PAGE_LIMIT * (page || 0),
    } : {}
    const response = await api.service('frequency').find({
      query: {
        ...pagination,
        ...query,
      },
    })
    context.commit('update', response)
  },
}

export const getters = {
  byPractitioner({ result }) {
    const allFrequencies = flatten(map(result.data, 'practitioners'))
    return groupBy(allFrequencies, 'fullName')
  },
}
