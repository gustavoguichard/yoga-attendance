<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      clipped
      dark
      app
    >
      <main-menu />
    </v-navigation-drawer>
    <v-toolbar
      color="blue-grey"
      dark
      fixed
      app
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Yoga Attendance</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer color="blue-grey" class="white--text" app>
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center white--text>
          <span>Gustavo Guichard &copy; 2018</span>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import mainMenu from '@/components/main-menu.vue'

export default {
  name: 'default-layout',
  components: { mainMenu },
  data: () => ({
    drawer: true,
  }),
};
</script>

<style>
body {
  font-family: sans-serif;
}
main {
  box-sizing: border-box;
  padding: 1rem 2rem;
}
</style>
