<template>
  <v-snackbar v-if="notify" :color="notify.type" :value="true" :top="!isMobile" :multi-line="isMobile" :right="true" :timeout="0">
    {{ notify.text }}
     <v-btn flat @click="close">Ok</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('notification', ['notify']),
    isMobile() {
      return window.innerWidth < 950
    },
  },
  methods: {
    close() {
      this.$store.dispatch('notification/clear')
    },
  },
};
</script>
