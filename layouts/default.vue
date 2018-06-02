<template>
  <v-app id="ciyf-app" :class="$route.name">
    <application-controls />
    <notification-center />
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
  mounted() {
    this.$store.dispatch('ui/done')
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
