import { get, groupBy, reduce } from 'lodash'

const $sort = { title: 1 }
const groupedByTeacher = rooms => {
  const grouped = groupBy(rooms, 'teacherData.fullName')
  return reduce(grouped, (result, cr, name) => [...result, {
    name,
    avatar: get(cr, '[0].teacherData.avatar'),
    classes: cr,
  }], [])
}

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
      return groupedByTeacher(result.data || result)
    },
    withoutTeacher(state, { find }) {
      const query = { teacher: null, $sort }
      const result = find({ query })
      return result.data || result
    },
  },

  instanceDefaults: {
    // teacherData: 'Practitioner',
  },
  replaceItems: true,
  skipRequestIfExists: true,
}

export const hooks = {}
