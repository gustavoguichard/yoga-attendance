const flushCache = {}

const shouldKeep = (flush, service) =>
  ((!flush && +flush !== 0) || flush === flushCache[service])

const select = {
  practitioners: ['picture', 'teacher', 'nickName', 'fullName', 'email', 'birthdate'],
}

const sort = {
  practitioners: { fullName: 1 },
  classrooms: { title: 1 },
  payments: { status: 1 },
  frequency: undefined,
  enrollment: undefined,
}

const limit = {}

export default service => async ({ state, dispatch }, query = {}, flush) => {
  const $select = select[service]
  const $sort = sort[service]
  const $limit = limit[service] || 1000
  if (state[service].ids.length && shouldKeep(flush, service)) {
    return true
  }
  flushCache[service] = flush
  await dispatch('ui/load')
  await dispatch(`${service}/find`, { query: { $select, $sort, $limit, ...query } })
  return dispatch('ui/done')
}
