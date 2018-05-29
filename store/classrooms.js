import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'
import { filter, flatten, groupBy, map, reduce } from 'lodash'

export const state = () => ({
  classes: [],
})

export const mutations = {
  update(current, data) {
    current.classes = data
  },
  updateLesson(current, lesson) {
    current.lesson = lesson
  },
}

export const actions = {
  async find(context, params) {
    const response = await api.service('classrooms').find(paramsForServer(params))
    context.commit('update', response.data)
  },
  async get(context, { id, query, ...params }) {
    const response = await api.service('classrooms').get(id, paramsForServer({ query, ...params }))
    context.commit('updateLesson', response)
  },
}

const groupedByTeacher = rooms => {
  const grouped = groupBy(rooms, 'teacher.fullName')
  return reduce(grouped, (result, cr, name) => [...result, {
    name,
    picture: cr[0].teacher && cr[0].teacher.picture,
    classes: cr,
  }], [])
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
