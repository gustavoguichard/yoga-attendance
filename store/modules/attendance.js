import Vue from 'vue'
import { concat, map, uniq, without } from 'lodash'

export default {
  state: () => ({
    selected: [],
    restitution: [],
    currentTeacher: undefined,
    newPractitioner: undefined,
  }),

  mutations: {
    cleanStore(st) {
      Vue.set(st, 'selected', [])
      Vue.set(st, 'restitution', [])
      Vue.set(st, 'currentTeacher', undefined)
    },
    updateRestitution(st, list) {
      Vue.set(st, 'restitution', uniq(list))
    },
    updateTeacher(st, teacher) {
      Vue.set(st, 'currentTeacher', teacher)
    },
    updateSelected(st, list) {
      Vue.set(st, 'selected', uniq(list))
    },
    updatePractitioner(st, person) {
      Vue.set(st, 'newPractitioner', person)
    },
  },

  actions: {
    addRestitution({ commit, state: st }, person) {
      commit('updateRestitution', [...st.restitution, person])
    },
    newPractitioner({ commit }, person) {
      commit('updatePractitioner', person)
    },
    clearPractitioner({ commit }) {
      commit('updatePractitioner', undefined)
    },
    toggle({ commit, getters, state: st }, person) {
      if (getters.isRestituting(person)) {
        const list = st.restitution.filter(p => p._id !== person._id)
        commit('updateRestitution', list)
      } else {
        const fn = st.selected.includes(person._id) ? without : concat
        const list = fn(st.selected, person._id)
        commit('updateSelected', list)
      }
    },
    toggleRestituting({ commit, state: st }, person) {
      const isPerson = ({ _id }) => _id === person._id
      const toggle = item => ({ ...item, restituting: !item.restituting })
      const list = map(st.restitution, item => isPerson(item) ? toggle(item) : item)
      commit('updateRestitution', list)
    },
  },

  getters: {
    everyAttendant({ selected, restitution }) {
      return [...selected, ...map(restitution, '_id')]
    },
    isRestituting: ({ restitution }) => ({ _id }) => map(restitution, '_id').includes(_id),
  },
}
