<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="lesson.teacherData && lesson.teacherData.displayName"
      :avatar="lesson.teacherData && lesson.teacherData.avatar"
    />
    <classroom-form title="Editando aula" :lesson="lesson" @submit="submit"></classroom-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import pageTitle from '@/components/page-title'
import classroomForm from '@/components/classroom-form'
import { mapState } from 'vuex'

export default {
  middleware: ['check-admin'],
  components: { classroomForm, pageTitle },
  computed: {
    ...mapState('classrooms', ['lesson']),
  },
  methods: {
    async submit({ _id, ...data }) {
      await service(this.$store, 'classrooms/patch', _id, data)
      this.$router.push('/')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('classrooms/get', { id: params.id })
  },
};
</script>
