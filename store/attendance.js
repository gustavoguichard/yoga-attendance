import Vue from 'vue'
import { concat, filter, includes, map, uniq, without } from 'lodash'

export const state = () => ({
  selected: [],
  restitution: [],
  currentTeacher: undefined,
})

export const mutations = {
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
}

export const actions = {
  addRestitution({ commit, state: st }, person) {
    commit('updateRestitution', [...st.restitution, person])
  },
  toggle({ commit, getters, state: st }, person) {
    if (getters.isRestituting(person)) {
      const list = filter(st.restitution, ({ _id }) => _id !== person._id)
      commit('updateRestitution', list)
    } else {
      const fn = includes(st.selected, person._id) ? without : concat
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
}

export const getters = {
  everyAttendant({ selected, restitution }) {
    return [...selected, ...map(restitution, '_id')]
  },
  isRestituting: ({ restitution }) => ({ _id }) => includes(map(restitution, '_id'), _id),
}
