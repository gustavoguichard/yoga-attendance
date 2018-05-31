<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="lesson.teacherData && lesson.teacherData.displayName"
      :picture="lesson.teacherData && lesson.teacherData.picture"
    />
    <classroom-form title="Editando aula" :lesson="lesson" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import api from '@/api'
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
    async submit({ _id, ...data }) {
      await api.service('classrooms').patch(_id, data)
      this.$router.push('/')
    },
  },
  async fetch({ store, params }) {
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
