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
  async ensureAuth({ state, commit }) {
    if (state.userData && !state.clientReady && process.client) {
      try {
        const { accessToken } = state.userData
        await api.authenticate({ strategy: 'jwt', accessToken })
        commit('authClient')
      } catch (error) { return error }
    }
    return null
  },
  updateUserData(context, data) {
    context.commit('update', data)
  },
  async clear(context) {
    api.logout()
    context.commit('logout')
  },
}
