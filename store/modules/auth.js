import api from '@/api'
import Vue from 'vue'
import { get } from 'lodash'

export default {
  state: () => ({
    user: null,
    publicPages: ['sign-in'],
  }),

  mutations: {
    update(state, data) {
      Vue.set(state, 'user', data)
    },
    logout(state) {
      Vue.set(state, 'user', null)
    },
  },

  actions: {
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
  },

  getters: {
    isAdmin({ user }) {
      return user && user.permissions.includes('admin')
    },
    currentPractitioner({ user }) {
      return get(user, 'practitioner') || {}
    },
  },
}
