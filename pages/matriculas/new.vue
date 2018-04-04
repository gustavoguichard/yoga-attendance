<template>
  <v-layout justify-center wrap>
    <enrollment-form title="Nova regra de pagamento" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: 'check-auth',
  components: { enrollmentForm },
  computed: {
    ...mapState('classrooms', ['classes']),
  },
  methods: {
    async submit(enrollment) {
      await this.$store.dispatch('auth/ensureAuth')
      await api.service('enrollment').create(enrollment)
      this.$router.push('/matriculas')
    },
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/find', { query: { regularClass: { $ne: true } } })
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
}
</style>
