<template>
  <div>
    <v-navigation-drawer v-if="!isSignIn" fixed clipped v-model="drawer" app>
    <v-list dense>
      <template v-for="(item, i) in items">
        <v-list-tile v-if="!item.admin || isAdmin" :to="item.to">
          <v-list-tile-action v-if="item.icon">
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
    <v-toolbar color="grey darken-3" dark fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="currentPractitioner._id" :to="`/praticantes/${currentPractitioner._id}`">
        <v-avatar v-if="currentPractitioner.avatar" size="24px">
          <img :src="currentPractitioner.avatar" />
        </v-avatar>
      </v-btn>
      <span class="user-email" v-if="user">
        {{ currentPractitioner.displayName || user.email }}
      </span>
      <v-btn icon to="/sign-out" v-if="user">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data: () => ({
    drawer: false,
    items: [
      { name: 'Aulas e eventos', to: '/', icon: 'event_note' },
      { name: 'Praticantes', to: '/praticantes', icon: 'group' },
      { name: 'Professores', to: '/professores', icon: 'record_voice_over', admin: true },
      { name: 'Presenças', to: '/presencas', icon: 'playlist_add_check' },
      { name: 'Acertos', to: '/acertos', icon: 'account_balance_wallet', admin: true },
      { name: 'Regras de pagamento', to: '/matriculas', icon: 'settings', admin: true },
    ],
  }),
  computed: {
    ...mapGetters('auth', ['isAdmin', 'currentPractitioner']),
    ...mapState('auth', ['user']),
    isSignIn() {
      return this.$route.name === 'sign-in'
    },
  },
};
</script>
