<template>
  <v-layout justify-center wrap>
    <enrollment-form :title="`${enrollment.className} - ${enrollment.type}`" :enrollment="currentEnrollment" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import fetchService from '@/api/fetch'
import { mapGetters } from 'vuex'
import decorate from '@/utils/decorate-enrollment'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  computed: {
    ...mapGetters('enrollment', ['get']),
    currentEnrollment() {
      return this.get(this.$route.params.id)
    },
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
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('enrollment')(store)
  },
};
</script>
