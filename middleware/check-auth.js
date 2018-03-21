export default function ({ store, redirect }) {
  // if (!store.state.auth.accessToken) {
  if (!store.state.auth) {
    redirect('/sign-in');
  }
}
