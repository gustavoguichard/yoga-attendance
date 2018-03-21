import Vue from 'vue'
import Vuex from 'vuex'
// import feathersVuex, { initAuth } from 'feathers-vuex'
// import feathersClient from '@/api'
import cookieparser from 'cookieparser'

// const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })
// const { auth } = feathersVuex(feathersClient, { idField: '_id' })

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: null,
  },
  mutations: {
    update(state, data) {
      state.auth = data
    },
  },
  actions: {
    // nuxtServerInit({ commit, dispatch }, { req }) {
    nuxtServerInit({ commit }, { req }) {
      // return initAuth({
      //   commit,
      //   dispatch,
      //   req,
      //   moduleName: 'auth',
      //   cookieName: 'feathers-jwt',
      // })
      const accessToken = () => {
        if (!req.headers.cookie) return null
        const parsed = cookieparser.parse(req.headers.cookie)
        return parsed['feathers-jwt']
      }
      commit('update', accessToken())
    },
  },
  plugins: [
    // service('practitioners'),
    // auth({ userService: 'users' }),
  ],
})

export default () => store
