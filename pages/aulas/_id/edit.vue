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
import fetchService from '@/api/fetch'
import pageTitle from '@/components/page-title'
import classroomForm from '@/components/classroom-form'
import { mapGetters } from 'vuex'

export default {
  middleware: ['check-admin'],
  components: { classroomForm, pageTitle },
  computed: {
    ...mapGetters('classrooms', ['get']),
    lesson() {
      return this.get(this.$route.params.id)
    },
  },
  methods: {
    async submit({ _id, ...data }) {
      await service(this.$store, 'classrooms/patch', _id, data)
      this.$router.push('/')
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
  },
};
</script>
