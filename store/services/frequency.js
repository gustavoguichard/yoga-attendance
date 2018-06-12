import { filterByTimeAgo, filterByTimeRange } from '@/utils/date-helpers'
import rootStore from '@/store'

const $sort = { 'practitioner.fullName': 1 } // Not working

export const store = {
  getters: {
    findByTimeAgo: (state, { find }) => ({ unit, unitsAgo }, query = {}) => {
      const frequency = find({ query: { $sort, ...query } })
      const data = [].concat(frequency.data || frequency)
      return filterByTimeAgo(data, 'createdAt', unit, unitsAgo)
    },
    findByTimeRange: (state, { find }) => (range, query = {}) => {
      const frequency = find({ query: { $sort, ...query } })
      const data = [].concat(frequency.data || frequency)
      return filterByTimeRange(data, 'createdAt', range)
    },
  },

  instanceDefaults: {
    createdAt: Date,
    updatedAt: Date,
  },
}

const { dispatch } = rootStore()
export const hooks = {
  before: {
    all: [hook => {
      dispatch('ui/load')
      return hook
    }],
  },
  after: {
    all: [hook => {
      dispatch('ui/done')
      return hook
    }],
  },
}
