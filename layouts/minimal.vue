<template>
  <v-app id="ciyf-app" :class="$route.name">
    <no-ssr>
      <notification-center></notification-center>
    </no-ssr>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <loading :active="loading"></loading>
        <v-layout justify-center class="page-container">
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import notificationCenter from '@/components/notification-center'
import loading from '@/components/loading'
import { mapGetters } from 'vuex'

export default {
  name: 'minimal',
  components: { loading, notificationCenter },
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
</style>
