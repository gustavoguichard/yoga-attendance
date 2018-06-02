<template>
  <v-layout justify-center wrap>
    <enrollment-form :title="`${enrollment.className} - ${enrollment.type}`" :enrollment="currentEnrollment" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import { mapState } from 'vuex'
import decorate from '@/utils/decorate-enrollment'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-auth', 'check-admin'],
  components: { enrollmentForm },
  computed: {
    ...mapState('enrollment', ['currentEnrollment']),
    ...mapState('classrooms', ['classes']),
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
    await store.dispatch('enrollment/get', { id: params.id })
    await store.dispatch('classrooms/find', { query: { regularClass: { $ne: true } } })
  },
};
</script>
