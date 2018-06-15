import { filterByTimeAgo, filterByTimeRange } from '@/utils/date-helpers'

const $sort = { 'practitioner.displayName': 1 } // Not working

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
}

export const hooks = {}
