<template>
  <v-layout justify-center wrap>
    <classroom-form title="Nova aula" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import classroomForm from '@/components/classroom-form'

export default {
  middleware: 'check-auth',
  components: { classroomForm },
  methods: {
    async submit(lesson) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('classrooms/create', lesson)
      this.$router.push('/')
    },
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('practitioners/find')
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
}
</style>
