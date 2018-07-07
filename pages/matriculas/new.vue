<template>
  <v-layout align-content-center align-center column>
    <enrollment-form title="Nova regra de pagamento" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  methods: {
    async submit(data) {
      const result = await new this.$FeathersVuex.Enrollment(data).save()
      if (result) this.$router.push('/matriculas')
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
  },
};
</script>
