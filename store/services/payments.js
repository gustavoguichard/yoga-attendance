import { filterByTimeAgo } from '@/utils/date-helpers'

export const store = {
  getters: {
    findByTimeAgo: (state, { find }) => ({ unit, unitsAgo }, query = {}) => {
      const payments = find({ query })
      const data = [].concat(payments.data || payments)
      return filterByTimeAgo(data, 'createdAt', unit, unitsAgo)
    },
  },

  instanceDefaults: {
    createdAt: Date,
    updatedAt: Date,
  },
  paginate: false,
}

export const hooks = {}
