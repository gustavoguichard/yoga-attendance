<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Novo praticante</v-toolbar-title>
      </v-toolbar>
      <practitioner-form @submit="submit"></practitioner-form>
    </v-card>
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
.card {
  margin: 1em;
  min-width: 400px;
  width: 60%;
}
</style>