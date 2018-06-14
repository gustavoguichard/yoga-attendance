export default function ({ store, route, redirect }) {
  const { online, offlinePages } = store.state.ui
  if (!online && !offlinePages.includes(route.name)) {
    store.dispatch('notification/offline')
    redirect('/')
  }
}
