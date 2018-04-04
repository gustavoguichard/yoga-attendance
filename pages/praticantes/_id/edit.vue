<template>
  <v-layout justify-center wrap>
    <practitioner-form :title="`Editando ${person.fullName}`" :person="person" @submit="submit"></practitioner-form>
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
      await this.$store.dispatch('practitioners/patch', person)
      this.$router.push('/praticantes')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('enrollment/find')
    await store.dispatch('practitioners/get', { id: params.id,
      query: { populateFamily: true },
    })
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
