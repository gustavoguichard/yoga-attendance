import Vuex from 'vuex'
import cookieparser from 'cookieparser'
import api from '@/api'
import { servicePlugins, modules } from '@/store/dynamic-modules'

export default function () {
  return new Vuex.Store({
    state: () => ({}),
    getters: {},
    actions: {
      async nuxtServerInit({ dispatch }, { req }) {
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          const accessToken = parsed['feathers-jwt']
          if (accessToken) {
            try {
              const data = await api.authenticate({ strategy: 'jwt', accessToken })
              const { userId } = await api.passport.verifyJWT(data.accessToken)
              const user = await api.service('users').get(userId)
              dispatch('auth/updateUserData', { ...data, ...user })
            } catch (error) { return error }
          }
        }
        return null
      },
    },
    modules,
    plugins: [
      ...servicePlugins(),
    ],
  })
}
