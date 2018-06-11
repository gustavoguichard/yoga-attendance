export const store = {
  getters: {
    teachers(state, { sortedFind }) {
      const query = { teacher: true }
      return sortedFind({ query })
    },
    sortedFind: (state, { find }) => params => {
      const query = { $sort: { displayName: 1 }, ...params.query }
      const result = find({ query })
      return result.data || result
    },
  },

  instanceDefaults: {
    family: null,
    familyData: 'Practitioner',
  },
  replaceItems: true,
  skipRequestIfExists: true,
}

export const hooks = {}
