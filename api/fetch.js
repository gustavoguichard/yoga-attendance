const $select = ['picture', 'teacher', 'nickName', 'fullName', 'email']
const $sort = { fullName: 1 }

export const fetchPractitioners = ({ state, dispatch }) => {
  const { practitioners } = state
  return practitioners.ids.length
    || dispatch('practitioners/find', { query: { $select, $sort } })
}
