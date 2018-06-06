export const fetchPractitioners = ({ state, dispatch }) => {
  const $select = ['picture', 'teacher', 'nickName', 'fullName', 'email']
  const $sort = { fullName: 1 }
  const { practitioners } = state
  return practitioners.ids.length
    || dispatch('practitioners/find', { query: { $select, $sort } })
}

export const fetchClassrooms = ({ state, dispatch }) => {
  const $sort = { title: 1 }
  const { classrooms } = state
  return classrooms.ids.length
    || dispatch('classrooms/find', { query: { $sort } })
}
