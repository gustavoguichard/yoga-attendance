<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed clipped v-model="drawer" app>
      <main-menu />
    </v-navigation-drawer>
    <v-toolbar color="blue-grey" dark fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/sign-out" v-if="userData">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-snackbar v-if="notify" :color="notify.type" :value="true" :top="true" :right="true" :timeout="0">
      {{ notify.text }}
       <v-btn flat @click="close">Ok</v-btn>
    </v-snackbar>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <loading :contextual="true" :active="active" />
        <nuxt />
      </v-container>
    </v-content>
    <v-footer color="blue-grey" class="white--text" app>
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center white--text>
          <span>&copy; 2018</span>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import mainMenu from '@/components/main-menu'
import loading from '@/components/loading'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'default-layout',
  components: { loading, mainMenu },
  data: () => ({ drawer: true }),
  computed: {
    ...mapState('auth', ['userData']),
    ...mapState('notification', ['notify']),
    ...mapGetters('loading', ['active']),
  },
  methods: {
    close() {
      this.$store.dispatch('notification/clear')
    },
  },
  mounted() {
    this.$store.dispatch('loading/stop')
  },
};
</script>

<style>
.app-container {
  position: relative;
}
</style>
