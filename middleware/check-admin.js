import { includes } from 'lodash'

export default function ({ store, redirect }) {
  const { user } = store.state.auth
  if (!user || !includes(user.permissions, 'admin')) {
    redirect('/')
    store.dispatch('notification/403')
  }
}
