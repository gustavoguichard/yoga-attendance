export default {
  state: () => ({
    requests: 1,
  }),
  mutations: {
    updateRequests(st, count) {
      st.requests = count
    },
  },
  actions: {
    load({ commit, state: st }) {
      commit('updateRequests', st.requests + 1)
    },
    done({ commit, state: st }) {
      commit('updateRequests', Math.max(0, st.requests - 1))
    },
  },
  getters: {
    loading({ requests }) {
      return requests > 0
    },
  },
}
