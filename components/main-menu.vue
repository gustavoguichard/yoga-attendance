<template>
  <v-list dense>
    <template v-for="(item, i) in items">
      <v-list-tile :to="item.to" v-if="item.show">
        <v-list-tile-action v-if="item.icon">
          <v-icon v-html="item.icon">spa</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-html="item.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('auth', ['userData']),
    isAuthenticated() {
      return !!this.userData;
    },
    items() {
      return [
        { name: 'Home', to: '/', icon: 'spa', show: true },
        { name: 'Protected', to: '/protected', show: this.isAuthenticated },
        { name: 'Login', to: '/sign-in', show: !this.isAuthenticated },
        { name: 'Logout', to: '/sign-out', icon: 'exit_to_app', show: this.isAuthenticated },
      ]
    },
  },
};
</script>

<style>
/*.main-menu__item .nuxt-link-active {
  color: #92D3CE;
}*/
</style>