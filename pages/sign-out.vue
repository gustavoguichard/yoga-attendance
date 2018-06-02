<template>
  <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted() {
    this.exit()
  },
  methods: {
    ...mapActions({ signOut: 'auth/clear' }),
    async exit() {
      await this.signOut()
      this.$store.dispatch('notification/info', 'Até logo!')
      this.$router.replace('/sign-in')
    },
  },
};
</script>
