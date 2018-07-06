<template>
  <v-layout align-content-center align-center column>
    <page-title
      title="Iniciar chamada"
      subtitle="Selecione uma turma"
    />
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Por professor</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in classByTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <person-list-item :avatar="true" :person="teacher" property="name" :disabled="true" />
          <v-divider></v-divider>
          <class-tile
            v-for="lesson in teacher.classes"
            :key="lesson.title"
            :lesson="lesson"
            to="/chamada/:id"
            :viewFrequency="online && viewFrequency"
            :editClass="isAdmin && online && editClass"
          ></class-tile>
        </template>
      </v-list>
      <v-toolbar>
        <v-toolbar-title>Outras turmas</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <class-tile
          v-for="lesson in withoutTeacher"
          :key="lesson.title"
          :lesson="lesson"
          to="/chamada/:id"
          :viewFrequency="online && viewFrequency"
          :editClass="isAdmin && online && editClass"
        ></class-tile>
      </v-list>
    </v-card>
    <page-cta v-if="isAdmin && online" to="/aulas/new" icon="add" />
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import fetchService from '@/api/fetch'
import { groupedByTeacher } from '@/utils/classrooms-helpers'
import classTile from '@/components/class-tile'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import pageCta from '@/components/page-cta'

export default {
  components: { classTile, pageCta, pageTitle, personListItem },
  computed: {
    ...mapState('ui', ['online']),
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      practitioners: 'practitioners/find',
      withTeacher: 'classrooms/withTeacher',
      withoutTeacher: 'classrooms/withoutTeacher',
    }),
    classByTeacher() {
      return groupedByTeacher(this.withTeacher, this.practitioners().data)
    },
  },
  methods: {
    viewFrequency({ _id }) {
      this.$router.push(`/presencas?classId=${_id}`)
    },
    editClass({ _id }) {
      this.$router.push(`/aulas/${_id}/edit`)
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
  },
};
</script>
