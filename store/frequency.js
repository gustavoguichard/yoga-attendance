import api from '@/api'

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
  async fetch(context, { params, query }) {
    const skip = PAGE_LIMIT * (query.page || 0)
    const response = await api.service('frequency').find({
      query: {
        $limit: PAGE_LIMIT,
        $skip: skip,
        classId: params.id,
      },
    })
    console.log(response)
    context.commit('update', response)
  },
}

export const getters = {
}
