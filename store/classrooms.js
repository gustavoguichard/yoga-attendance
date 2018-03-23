import { filter, flatten, groupBy, map, reduce } from 'lodash'
import api from '@/api'

export const state = () => ({
  classes: [],
})

export const mutations = {
  update(current, data) {
    current.classes = data
  },
}

export const actions = {
  async fetch(context) {
    const response = await api.service('classrooms').find()
    context.commit('update', response.data)
  },
}

const groupedByTeacher = rooms => {
  const grouped = groupBy(rooms, 'teacher.fullName')
  return reduce(grouped, (result, cr, name) => [...result, { name, classes: cr }], [])
}

export const getters = {
  classByTeacher({ classes }) {
    const grouped = groupedByTeacher(classes)
    return filter(grouped, item => item.name !== 'undefined')
  },
  classWithoutTeacher({ classes }) {
    const grouped = groupedByTeacher(classes)
    const filtered = filter(grouped, item => item.name === 'undefined')
    return flatten(map(filtered, 'classes'))
  },
}
