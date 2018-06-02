<template>
  <v-layout justify-center wrap>
    <v-card class="half">
      <v-toolbar>
        <v-toolbar-title>Selecione a turma pelo professor</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in withTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <person-list-item :avatar="true" :person="teacher" property="name" :disabled="true" />
          <v-divider></v-divider>
          <class-tile
            v-for="lesson in teacher.classes"
            :key="lesson.title"
            :lesson="lesson"
            :callback="openLesson"
            :viewFrequency="viewFrequency"
            :editClass="isAdmin && editClass"
          ></class-tile>
        </template>
      </v-list>
    </v-card>
    <v-card class="half">
      <v-toolbar>
        <v-toolbar-title>Outras turmas</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <class-tile
          v-for="lesson in withoutTeacher"
          :key="lesson.title"
          :lesson="lesson"
          :callback="openLesson"
          :viewFrequency="viewFrequency"
          :editClass="isAdmin && editClass"
        ></class-tile>
      </v-list>
    </v-card>
    <page-cta to="/aulas/new" icon="add" />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import classTile from '@/components/class-tile'
import personListItem from '@/components/person-list-item'
import pageCta from '@/components/page-cta'

export default {
  middleware: 'check-auth',
  components: { classTile, pageCta, personListItem },
  computed: mapGetters({
    isAdmin: 'auth/isAdmin',
    withTeacher: 'classrooms/classByTeacher',
    withoutTeacher: 'classrooms/classWithoutTeacher',
  }),
  methods: {
    openLesson({ _id }) {
      this.$router.push(`/chamada/${_id}`)
    },
    viewFrequency({ _id }) {
      this.$router.push(`/presencas?classId=${_id}`)
    },
    editClass({ _id }) {
      this.$router.push(`/aulas/${_id}/edit`)
    },
  },
  async fetch({ store }) {
    await store.dispatch('classrooms/find')
  },
};
</script>
