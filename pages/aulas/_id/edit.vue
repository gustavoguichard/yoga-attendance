<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="lesson.teacher && lesson.teacher.displayName"
      :picture="lesson.teacher && lesson.teacher.picture"
    />
    <classroom-form title="Editando aula" :lesson="lesson" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import pageTitle from '@/components/page-title'
import classroomForm from '@/components/classroom-form'
import { mapState } from 'vuex'

export default {
  middleware: 'check-auth',
  components: { classroomForm, pageTitle },
  computed: {
    ...mapState('classrooms', ['lesson']),
  },
  methods: {
    async submit(lesson) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('classrooms/patch', lesson)
      this.$router.push('/')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', { id: params.id })
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
