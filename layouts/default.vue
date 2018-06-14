<template>
  <v-app id="ciyf-app" :class="$route.name">
    <application-controls />
    <no-ssr>
      <notification-center />
    </no-ssr>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <loading :active="loading" />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import applicationControls from '@/components/application-controls'
import notificationCenter from '@/components/notification-center'
import loading from '@/components/loading'
import { mapGetters } from 'vuex'

export default {
  name: 'default-layout',
  components: { applicationControls, loading, notificationCenter },
  computed: {
    ...mapGetters('ui', ['loading']),
  },
  methods: {
    online() {
      this.$store.dispatch('notification/info', 'Você está online novamente!')
      this.$store.commit('ui/connection', true)
    },
    offline() {
      this.$store.dispatch('notification/error', 'Você está offline! Algumas funcionalidades ficarão limitadas')
      this.$store.commit('ui/connection', false)
    },
  },
  mounted() {
    this.$store.dispatch('ui/done')
    if (!window.navigator) {
      return
    }
    const online = Boolean(window.navigator.onLine)
    this.$store.commit('ui/connection', online)
    window.addEventListener('online', this.online, false)
    window.addEventListener('offline', this.offline, false)
  },
  destroyed() {
    window.removeEventListener('online', this.online, false)
    window.removeEventListener('offline', this.offline, false)
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
