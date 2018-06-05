export default function ({ store, redirect, route }) {
  const { auth } = store.state
  if (!auth.publicPages.includes(route.name) && !auth.user) {
    redirect('/sign-in');
    store.dispatch('notification/401')
  }
}
