import Vue from 'vue'

const notification = options => ({
  type: 'info',
  persist: false,
  ...options,
})

export default {
  state: () => ({ notify: undefined }),

  mutations: {
    update(st, object) {
      Vue.set(st, 'notify', object)
      if (object && !object.persist) {
        setTimeout(() => this.dispatch('notification/clear'), 6000)
      }
    },
  },

  actions: {
    notify({ commit }, options) {
      commit('update', notification(options))
    },
    info({ commit }, text) {
      commit('update', notification({ text }))
    },
    error({ commit }, text) {
      commit('update', notification({ text, type: 'error' }))
    },
    success({ commit }, text) {
      commit('update', notification({ text, type: 'success' }))
    },
    clear({ commit }) {
      commit('update')
    },
    offline({ commit }) {
      commit('update', notification({ text: 'Você precisa se conectar para prosseguir', type: 'error' }))
    },
    403({ commit }) {
      commit('update', notification({ text: 'Você não está autorizado a acessar esta página', type: 'error' }))
    },
    401({ commit }) {
      commit('update', notification({ text: 'Você deve fazer login primeiro' }))
    },
  },
}
