<template>
  <div>
    <main-menu :isMobile="isMobile" />
    <v-toolbar color="grey darken-3" dark fixed app clipped-left>
      <v-toolbar-side-icon v-show="isMobile" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-show="isMobile">CIYF</v-toolbar-title>
      <template v-show="isMobile === false">
        <v-avatar size="36" class="ml-2">
          <img src="/icon.png" alt="Logo" />
        </v-avatar>
        <v-toolbar-title>Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      </template>
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
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown
    },
  },
}
</script>
