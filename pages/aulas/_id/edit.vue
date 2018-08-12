<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="teacher && teacher.displayName"
      :avatar="teacher && teacher.avatar"
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
  components: { classroomForm, pageTitle },
  computed: {
    ...mapGetters({
      getClass: 'classrooms/get',
      getPerson: 'practitioners/get',
    }),
    lesson() {
      return this.getClass(this.$route.params.id)
    },
    teacher() {
      return this.getPerson(this.lesson.teacher)
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
