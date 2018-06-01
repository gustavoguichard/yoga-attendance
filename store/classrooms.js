import { service } from '@/api'
import { filter, flatten, get, groupBy, map, reduce } from 'lodash'

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
    const response = await service(this, 'classrooms/find', params)
    context.commit('update', response.data)
  },
  async get(context, { id, query }) {
    const response = await service(this, 'classrooms/get', id, { query })
    context.commit('updateLesson', response)
  },
}

const groupedByTeacher = rooms => {
  const grouped = groupBy(rooms, 'teacherData.fullName')
  return reduce(grouped, (result, cr, name) => [...result, {
    name,
    picture: get(cr, '[0].teacherData.picture'),
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
