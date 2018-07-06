<template>
  <div>
    <v-navigation-drawer fixed clipped v-model="drawer" app>
      <main-menu />
    </v-navigation-drawer>
    <v-toolbar color="grey darken-3" dark fixed app clipped-left>
      <v-toolbar-side-icon v-if="isMobile" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-if="isMobile">CIYF</v-toolbar-title>
      <template v-else>
        <v-avatar size="36">
          <img src="/icon.png" alt="Logo" />
        </v-avatar>
        <v-toolbar-title>Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      </template>
      <v-spacer></v-spacer>
      <syncer />
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
import mainMenu from './main-menu'

export default {
  components: { mainMenu, syncer },
  data: () => ({ drawer: !this.isMobile }),
  computed: {
    ...mapGetters('auth', ['currentPractitioner']),
    ...mapState('auth', ['user']),
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown
    },
  },
};
</script>
