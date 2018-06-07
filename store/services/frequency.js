import { filterByTimeAgo, filterByTimeRange } from '@/utils/date-helpers'

export const store = {
  getters: {
    findByTimeAgo: (state, { find }) => ({ unit, unitsAgo }, query = {}) => {
      const frequency = find({ query })
      const data = [].concat(frequency.data || frequency)
      return filterByTimeAgo(data, 'createdAt', unit, unitsAgo)
    },
    findByTimeRange: (state, { find }) => (range, query = {}) => {
      const frequency = find({ query })
      const data = [].concat(frequency.data || frequency)
      return filterByTimeRange(data, 'createdAt', range)
    },
  },

  instanceDefaults: {
    createdAt: Date,
    updatedAt: Date,
  },
}

export const hooks = {}
