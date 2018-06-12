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
    async submit(lesson) {
      const result = await new this.$FeathersVuex.Classroom(lesson).patch()
      if (result) this.$router.push('/')
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
  },
};
</script>
