<template>
  <v-layout justify-center wrap>
    <enrollment-form title="Nova regra de pagamento" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import fetchService from '@/api/fetch'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  methods: {
    async submit(enrollment) {
      await service(this.$store, 'enrollment/create', enrollment)
      this.$router.push('/matriculas')
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
  },
};
</script>
