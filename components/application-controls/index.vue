<template>
  <div>
    <v-navigation-drawer fixed clipped v-model="drawer" app>
      <main-menu :isMobile="isMobile" />
    </v-navigation-drawer>
    <v-toolbar color="grey darken-3" dark fixed app clipped-left>
      <v-toolbar-side-icon v-show="isMobile" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-show="isMobile">CIYF</v-toolbar-title>
      <v-avatar v-show="!isMobile" size="36" class="ml-2">
        <img src="/icon.png" alt="Logo" />
      </v-avatar>
      <v-toolbar-title v-show="!isMobile">Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      <v-spacer></v-spacer>
      <syncer />
      <user-menu />
    </v-toolbar>
  </div>
</template>

<script>
import syncer from './syncer'
import mainMenu from './main-menu'
import userMenu from './user-menu'

export default {
  components: { mainMenu, syncer, userMenu },
  data: () => ({ drawer: false }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown
    },
  },
  mounted() {
    if (!this.isMobile) {
      this.drawer = true
    }
  },
}
</script>
