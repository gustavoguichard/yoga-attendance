<template>
  <v-layout justify-center wrap>
    <classroom-form title="Nova aula" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import classroomForm from '@/components/classroom-form'

export default {
  middleware: ['check-auth', 'check-admin'],
  components: { classroomForm },
  methods: {
    async submit(lesson) {
      await service(this.$store, 'classrooms/create', lesson)
      this.$router.push('/')
    },
  },
  async fetch({ store }) {
    await store.dispatch('practitioners/find')
  },
};
</script>
