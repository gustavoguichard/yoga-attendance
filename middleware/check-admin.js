export default function ({ store, redirect }) {
  const { user } = store.state.auth
  if (!user || !user.permissions.includes('admin')) {
    redirect('/')
    store.dispatch('notification/403')
  }
}
