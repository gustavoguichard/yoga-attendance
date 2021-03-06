export const store = {
  getters: {
    teachers(state, { sortedFind }) {
      const query = { teacher: true }
      return sortedFind({ query })
    },
    nonTeachers(state, { sortedFind }) {
      const query = { teacher: false }
      return sortedFind({ query })
    },
    sortedFind: (state, { find }) => params => {
      const query = { $sort: { displayName: 1 }, ...params.query }
      const result = find({ query })
      return result.data || result
    },
  },

  replaceItems: true,
  skipRequestIfExists: true,
}

export const hooks = {}
