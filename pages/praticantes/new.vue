<template>
  <v-layout justify-center wrap>
    <practitioner-form title="Novo Praticante" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import practitionerForm from '@/components/practitioner-form'

export default {
  middleware: 'check-auth',
  components: { practitionerForm },
  methods: {
    async submit(person) {
      await service(this.$store, 'practitioners/create', person)
      this.$router.push('/praticantes')
    },
  },
  async fetch({ store }) {
    await store.dispatch('enrollment/find')
  },
};
</script>
