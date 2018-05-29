import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'

const PAGE_LIMIT = 20

export const state = () => ({
  result: [],
})

export const mutations = {
  update(current, data) {
    current.result = data
  },
  updatePeopleList(current, data) {
    current.peopleList = data
  },
}

export const actions = {
  async find(context, { page, query, ...params }) {
    const pagination = page ? {
      $limit: PAGE_LIMIT,
      $skip: PAGE_LIMIT * (page || 0),
    } : {}
    const response = await api.service('frequency').find(paramsForServer({
      ...params,
      query: {
        $sort: { createdAt: -1 },
        ...pagination,
        ...query,
      },
    }))
    context.commit('update', response.data)
  },

  async get(context, { id, query, ...params }) {
    const response = await api.service('frequency').get(id, paramsForServer({ query, ...params }))
    context.commit('updatePeopleList', response)
  },
}
