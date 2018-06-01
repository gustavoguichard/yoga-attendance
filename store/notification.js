import Vue from 'vue'

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
  notify({ commit }, text) {
    commit('update', { text })
  },
  clear({ commit }) {
    commit('update')
  },
}
