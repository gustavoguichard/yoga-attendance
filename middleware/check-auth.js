export default function ({ store, redirect }) {
  if (!store.state.auth.user) {
    redirect('/sign-in');
    store.dispatch('notification/info', 'Você deve fazer login primeiro')
  }
}
