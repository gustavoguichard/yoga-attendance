import api from '@/api'

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
  async find(context, { page, query }) {
    const pagination = page ? {
      $limit: PAGE_LIMIT,
      $skip: PAGE_LIMIT * (page || 0),
    } : {}
    const response = await api.service('frequency').find({
      query: {
        $sort: { createdAt: -1 },
        ...pagination,
        ...query,
      },
    })
    context.commit('update', response)
  },

  async get(context, { id, query }) {
    const response = await api.service('frequency').get(id, { query })
    context.commit('updatePeopleList', response)
  },
}
