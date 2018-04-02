<template>
  <v-layout justify-center wrap>
    <practitioner-form title="Novo Praticante" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import practitionerForm from '@/components/practitioner-form'

export default {
  middleware: 'check-auth',
  components: { practitionerForm },
  methods: {
    async submit(person) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/create', person)
      this.$router.push('/praticantes')
    },
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/find')
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