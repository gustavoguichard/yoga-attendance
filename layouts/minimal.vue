<template>
  <v-app id="ciyf-app" :class="$route.name">
    <no-ssr>
      <notification-center></notification-center>
    </no-ssr>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import notificationCenter from '@/components/notification-center'

export default {
  name: 'minimal',
  components: { notificationCenter },
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
