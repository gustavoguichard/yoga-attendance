import { groupBy, reduce } from 'lodash'
import { sortByKey } from '@/utils/helpers'

const group = rooms => {
  const grouped = groupBy(rooms, 'fullName')
  const sorted = sortByKey(grouped)
  return reduce(sorted, (result, classes, name) => {
    const { avatar } = classes[0] || {}
    return result.concat({ name, avatar, classes })
  }, [])
}

export const groupedByTeacher = (classrooms, practitioners) => {
  const populated = classrooms.map(lesson => {
    const { fullName, avatar } = practitioners.find(p => p._id === lesson.teacher)
    return { ...lesson, fullName, avatar }
  })
  const grouped = group(populated)
  return grouped
}
