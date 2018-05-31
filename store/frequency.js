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
    this.dispatch('loading/start')
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
    context.commit('update', response.data)
    this.dispatch('loading/stop')
  },

  async get(context, { id, query }) {
    this.dispatch('loading/start')
    const response = await api.service('frequency').get(id, { query })
    context.commit('updatePeopleList', response)
    this.dispatch('loading/stop')
  },
}
