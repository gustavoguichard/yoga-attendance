<template>
  <div class="mr-0">
    <v-btn icon v-if="currentPractitioner" :to="`/praticantes/${currentPractitioner._id}`">
      <v-avatar v-if="currentPractitioner.avatar" size="24px">
        <img :src="currentPractitioner.avatar" />
      </v-avatar>
    </v-btn>
    <span class="user-email" v-if="user">
      {{ currentPractitioner.displayName || user.email }}
    </span>
    <v-btn icon @click="logout" v-if="user">
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['currentPractitioner']),
    ...mapState('auth', ['user']),
  },
  methods: {
    ...mapActions({ signOut: 'auth/clear' }),
    async logout() {
      await this.signOut()
      this.$store.dispatch('notification/info', 'Até logo!')
      this.$router.push('/sign-in')
    },
  },
}
</script>
