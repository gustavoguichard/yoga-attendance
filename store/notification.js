import Vue from 'vue'

const notification = options => ({
  type: 'info',
  persist: false,
  ...options,
})

export const state = () => ({ notify: undefined })

export const mutations = {
  update(st, object) {
    Vue.set(st, 'notify', object)
    if (object && !object.persist) {
      setTimeout(() => this.dispatch('notification/clear'), 6000)
    }
  },
}

export const actions = {
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
}
