import Vue from 'vue'

export default {
  state: () => ({
    frequency: [],
    practitioners: [],
    syncing: false,
  }),
  mutations: {
    addFrequency(st, freq) {
      st.frequency.push(freq)
    },
    addPractitioner(st, practitioner) {
      st.practitioners.push(practitioner)
    },
    clear(st) {
      Vue.set(st, 'frequency', [])
      Vue.set(st, 'practitioners', [])
      Vue.set(st, 'syncing', false)
    },
    changeSync(st, syncing) {
      Vue.set(st, 'syncing', syncing)
    },
  },
  actions: {
    sync({ commit }) {
      commit('changeSync', true)
    },
    done({ commit }) {
      commit('clear')
    },
  },
  getters: {
    pending(st) {
      return !!(st.frequency.length || st.practitioners.length)
    },
  },
}
