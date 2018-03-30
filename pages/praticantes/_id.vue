<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Editando: {{ person.fullName }}</v-toolbar-title>
      </v-toolbar>
      <practitioner-form :person="person" @submit="submit"></practitioner-form>
    </v-card>
  </v-layout>
</template>

<script>
import practitionerForm from '@/components/practitioner-form'
import { mapState } from 'vuex'

export default {
  middleware: 'check-auth',
  components: { practitionerForm },
  computed: {
    ...mapState('practitioners', ['person', 'editingPerson']),
  },
  methods: {
    async submit(person) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/patch', person)
      this.$router.push('/praticantes')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/find')
    await store.dispatch('practitioners/get', params.id)
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