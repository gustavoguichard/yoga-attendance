<template>
  <v-layout justify-center wrap>
    <enrollment-form title="Nova regra de pagamento" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import { mapState } from 'vuex'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  computed: {
    ...mapState('classrooms', ['classes']),
  },
  methods: {
    async submit(enrollment) {
      await service(this.$store, 'enrollment/create', enrollment)
      this.$router.push('/matriculas')
    },
  },
  async fetch({ store }) {
    await store.dispatch('classrooms/find', { query: { regularClass: { $ne: true } } })
  },
};
</script>
