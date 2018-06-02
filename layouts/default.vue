<template>
  <v-app id="ciyf-app" :class="$route.name">
    <v-navigation-drawer v-if="!isSignIn" fixed clipped v-model="drawer" app>
      <main-menu />
    </v-navigation-drawer>
    <v-toolbar color="grey darken-3" dark fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Centro Iyengar Yoga Florianópolis</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="currentPractitioner._id" :to="`/praticantes/${currentPractitioner._id}`">
        <v-avatar v-if="currentPractitioner.picture" size="24px">
          <img :src="currentPractitioner.picture" />
        </v-avatar>
      </v-btn>
      <span class="user-email" v-if="user">
        {{ currentPractitioner.displayName || user.email }}
      </span>
      <v-btn icon to="/sign-out" v-if="user">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-snackbar v-if="notify" :color="notify.type" :value="true" :top="!isMobile" :right="true" :timeout="0">
      {{ notify.text }}
       <v-btn flat @click="close">Ok</v-btn>
    </v-snackbar>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <loading :contextual="true" :active="active" />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import mainMenu from '@/components/main-menu'
import loading from '@/components/loading'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'default-layout',
  components: { loading, mainMenu },
  data: () => ({ drawer: false }),
  computed: {
    ...mapGetters('auth', ['currentPractitioner']),
    ...mapGetters('loading', ['active']),
    ...mapState('auth', ['user']),
    ...mapState('notification', ['notify']),
    isMobile() {
      return window.innerWidth < 950
    },
    isSignIn() {
      return this.$route.name === 'sign-in'
    },
  },
  methods: {
    close() {
      this.$store.dispatch('notification/clear')
    },
  },
  mounted() {
    this.drawer = !this.isMobile
    this.$store.dispatch('loading/stop')
  },
};
</script>

<style>
.app-container {
  position: relative;
}

@media only screen and (max-width: 599px) {
  .user-email {
    display: none;
  }
}
</style>
