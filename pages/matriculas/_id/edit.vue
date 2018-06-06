<template>
  <v-layout justify-center wrap>
    <enrollment-form :title="`${enrollment.className} - ${enrollment.type}`" :enrollment="currentEnrollment" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import { fetchClassrooms } from '@/api/fetch'
import { mapState } from 'vuex'
import decorate from '@/utils/decorate-enrollment'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  computed: {
    ...mapState('enrollment', ['currentEnrollment']),
    enrollment() {
      return decorate(this.currentEnrollment)
    },
  },
  methods: {
    async submit({ _id, ...data }) {
      await service(this.$store, 'enrollment/patch', _id, data)
      this.$router.push('/matriculas')
    },
  },
  async fetch({ store, params }) {
    await fetchClassrooms(store)
    await store.dispatch('enrollment/get', { id: params.id })
  },
};
</script>
