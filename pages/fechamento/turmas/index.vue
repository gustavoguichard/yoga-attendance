<template>
  <v-layout align-content-center align-center column>
    <page-title
      title="Fechamento Mensal"
      subtitle="Por turma"
    />
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Por professor</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-list two-line>
        <template v-for="(teacher, i) in withTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <person-list-item :avatar="true" :person="teacher" property="name" :disabled="true" />
          <v-divider></v-divider>
          <class-tile
            v-for="lesson in teacher.classes"
            :key="lesson.title"
            :lesson="lesson"
            to="/fechamento/turmas/:id"
          ></class-tile>
        </template>
      </v-list>
      <v-divider />
      <v-toolbar>
        <v-toolbar-title>Outras turmas</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-list two-line>
        <class-tile
          v-for="lesson in withoutTeacher"
          :key="lesson.title"
          :lesson="lesson"
          to="/fechamento/turmas/:id"
        ></class-tile>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import fetchService from '@/api/fetch'
import classTile from '@/components/class-tile'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'

export default {
  middleware: ['check-admin'],
  components: { classTile, pageTitle, personListItem },
  computed: {
    ...mapGetters({
      withTeacher: 'classrooms/withTeacher',
      withoutTeacher: 'classrooms/withoutTeacher',
    }),
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
  },
};
</script>
