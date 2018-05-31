export const state = () => ({ requests: 1 })

export const mutations = {
  change(st, count) {
    st.requests = count
  },
}

export const actions = {
  start({ commit, state: st }) {
    commit('change', st.requests + 1)
  },
  stop({ commit, state: st }) {
    commit('change', Math.max(0, st.requests - 1))
  },
}

export const getters = {
  active({ requests }) {
    return requests > 0
  },
}
