const $sort = { title: 1 }

export const store = {
  getters: {
    regularClasses(state, { find }) {
      const query = { regularClass: true, $sort }
      const result = find({ query })
      return result.data || result
    },
    eventClasses(state, { find }) {
      const query = { regularClass: { $ne: true }, $sort }
      const result = find({ query })
      return result.data || result
    },
    withTeacher(state, { find }) {
      const query = { teacher: { $ne: null }, $sort }
      const result = find({ query })
      return result.data || result
    },
    withoutTeacher(state, { find }) {
      const query = { teacher: null, $sort }
      const result = find({ query })
      return result.data || result
    },
  },

  replaceItems: true,
  skipRequestIfExists: true,
}

export const hooks = {}
