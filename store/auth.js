import api from '@/api'

export const mutations = {
  update(state, data) {
    state.userData = data
  },
  logout(state) {
    state.userData = null
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
