import Vue from 'vue'

let timer

export default {
  state: () => ({
    requests: 1,
    online: true,
    offlinePages: [
      'index',
      'praticantes',
      'praticantes-new',
      'praticantes-id-edit',
      'chamada',
      'chamada-id',
      'sign-in',
    ],
  }),
  mutations: {
    updateRequests(st, count) {
      Vue.set(st, 'requests', count)
      if (count > 0) {
        timer = setInterval(() => {
          Vue.set(st, 'requests', 0)
        }, 20000)
      } else {
        clearInterval(timer)
      }
    },
    connection(st, online) {
      Vue.set(st, 'online', online)
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
