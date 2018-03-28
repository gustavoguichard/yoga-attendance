<template>
  <v-list dense>
    <template v-for="(item, i) in items">
      <v-list-tile :to="item.to" v-if="show(item)">
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
  methods: {
    show(page) {
      return this.isAuthenticated ? !page.unlogged : !!page.unlogged
    },
  },
  computed: {
    ...mapState('auth', ['userData']),
    isAuthenticated() {
      return !!this.userData;
    },
    items() {
      return [
        { name: 'Aulas', to: '/', icon: 'spa' },
        { name: 'Praticantes', to: '/praticantes', icon: 'group' },
        { name: 'Login', to: '/sign-in', icon: 'person_add', unlogged: true },
        { name: 'Logout', to: '/sign-out', icon: 'exit_to_app' },
      ]
    },
  },
};
</script>
