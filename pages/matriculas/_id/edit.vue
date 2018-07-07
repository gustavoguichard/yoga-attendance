<template>
  <v-layout align-content-center align-center column>
    <enrollment-form :title="`${enrollment.className} - ${enrollment.type}`" :enrollment="currentEnrollment" @submit="submit"></enrollment-form>
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import { mapGetters } from 'vuex'
import decorate from '@/utils/decorate-enrollment'
import enrollmentForm from '@/components/enrollment-form'

export default {
  middleware: ['check-admin'],
  components: { enrollmentForm },
  computed: {
    ...mapGetters({
      get: 'enrollment/get',
      getClass: 'classrooms/get',
    }),
    currentEnrollment() {
      return this.get(this.$route.params.id)
    },
    enrollment() {
      const lesson = this.getClass(this.currentEnrollment.classId)
      return decorate(this.currentEnrollment, lesson)
    },
  },
  methods: {
    async submit(data) {
      const result = await new this.$FeathersVuex.Enrollment(data).patch()
      if (result) this.$router.push('/matriculas')
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('enrollment')(store)
  },
};
</script>
