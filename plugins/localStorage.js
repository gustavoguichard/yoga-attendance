import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'ciyf-storage',
    paths: [
      'practitioners',
      'classrooms',
      'enrollment',
      'frequency',
      'payments',
      'users',
      'attendance',
    ],
  })(store)
}
