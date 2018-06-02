export const state = () => ({
  requests: 1,
})

export const mutations = {
  updateRequests(st, count) {
    st.requests = count
  },
}

export const actions = {
  load({ commit, state: st }) {
    commit('updateRequests', st.requests + 1)
  },
  done({ commit, state: st }) {
    commit('updateRequests', Math.max(0, st.requests - 1))
  },
}

export const getters = {
  loading({ requests }) {
    return requests > 0
  },
}
