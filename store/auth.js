import api from '@/api'
import Vue from 'vue'
import { get, includes } from 'lodash'

export const mutations = {
  update(state, data) {
    Vue.set(state, 'user', data)
  },
  logout(state) {
    Vue.set(state, 'user', null)
  },
}

export const actions = {
  async authenticate(context, options) {
    const data = await api.authenticate({ strategy: 'local', ...options })
    const { userId } = await api.passport.verifyJWT(data.accessToken)
    const user = await api.service('users').get(userId)
    context.commit('update', { ...data, ...user })
  },
  updateUserData(context, data) {
    context.commit('update', data)
  },
  async clear(context) {
    api.logout()
    context.commit('logout')
  },
}

export const getters = {
  isAdmin({ user }) {
    return includes(user && user.permissions, 'admin')
  },
  currentPractitioner({ user }) {
    return get(user, 'practitioner') || {}
  },
}
