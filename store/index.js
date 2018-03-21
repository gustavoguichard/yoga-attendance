import cookieparser from 'cookieparser'
import api from '@/api'

export const state = () => ({})
export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      const accessToken = parsed['feathers-jwt']
      if (accessToken) {
        try {
          const data = await api.authenticate({ strategy: 'jwt', accessToken })
          dispatch('auth/updateUserData', data)
        } catch (error) { return error }
      }
    }
  },
}
