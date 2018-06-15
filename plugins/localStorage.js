import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'ciyf-storage',
    paths: [
      'offline',
    ],
  })(store)
}
