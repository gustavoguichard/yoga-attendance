import api from '@/api'

export const mutations = {
  update(state, data) {
    state.userData = data
  },
  authClient(state) {
    state.clientReady = true
  },
  logout(state) {
    state.userData = null
  },
}

export const actions = {
  async authenticate(context, options) {
    const data = await api.authenticate({ strategy: 'local', ...options })
    context.commit('update', data)
  },
  updateUserData(context, data) {
    context.commit('update', data)
  },
  async clear(context) {
    api.logout()
    context.commit('logout')
  },
}
