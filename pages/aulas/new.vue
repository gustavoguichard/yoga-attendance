<template>
  <v-layout justify-center wrap>
    <classroom-form title="Nova aula" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import classroomForm from '@/components/classroom-form'

export default {
  middleware: ['check-admin'],
  components: { classroomForm },
  methods: {
    async submit(lesson) {
      const result = await new this.$FeathersVuex.Classroom(lesson).save()
      if (result) this.$router.push('/')
    },
  },
  async fetch({ store }) {
    await fetchService('practitioners')(store)
  },
};
</script>
