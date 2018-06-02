import api from '@/api'
import { includes } from 'lodash'

export const mutations = {
  update(state, data) {
    state.user = data
  },
  logout(state) {
    state.user = null
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
}
