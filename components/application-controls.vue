<template>
  <div>
    <v-navigation-drawer v-if="!isSignIn" fixed clipped v-model="drawer" app>
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-list-tile v-if="visibleItem(item)" :to="item.to">
            <v-list-tile-action v-if="item.icon">
              <v-icon v-html="item.icon"></v-icon>
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
      <v-toolbar-title>CIYF</v-toolbar-title>
      <v-spacer></v-spacer>
      <syncer></syncer>
      <v-btn icon v-if="currentPractitioner" :to="`/praticantes/${currentPractitioner._id}`">
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
import syncer from '@/components/syncer'

export default {
  components: { syncer },
  data: () => ({
    drawer: false,
    items: [
      { name: 'Aulas e eventos', to: '/', icon: 'event_note' },
      { name: 'Praticantes', to: '/praticantes', icon: 'group' },
      { name: 'Professores', to: '/professores', icon: 'record_voice_over', online: true, admin: true },
      { name: 'Presenças', to: '/presencas', icon: 'playlist_add_check', online: true },
      { name: 'Regras de pagamento', to: '/matriculas', icon: 'settings', online: true, admin: true },
    ],
  }),
  computed: {
    ...mapGetters('auth', ['isAdmin', 'currentPractitioner']),
    ...mapState('auth', ['user']),
    ...mapState('ui', ['online']),
    isSignIn() {
      return this.$route.name === 'sign-in'
    },
  },
  methods: {
    visibleItem(item) {
      return (!item.admin || this.isAdmin) && (!item.online || this.online)
    },
  },
};
</script>
