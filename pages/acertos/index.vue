<template>
  <v-layout justify-center wrap>
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Selecione uma turma</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in classByTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <person-list-item :avatar="true" :person="teacher" property="name" :disabled="true" />
          <v-divider></v-divider>
          <class-tile v-for="lesson in teacher.classes" :key="lesson.title" :lesson="lesson" :callback="classClicked"></class-tile>

        </template>
        <v-divider></v-divider>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <v-icon>group</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Outras turmas</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <class-tile v-for="(lesson, i) in classWithoutTeacher" :key="i" :lesson="lesson" :callback="classClicked"></class-tile>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import classTile from '@/components/class-tile'
import personListItem from '@/components/person-list-item'

export default {
  middleware: ['check-auth', 'check-admin'],
  components: { classTile, personListItem },
  computed: {
    ...mapGetters('classrooms', ['classByTeacher', 'classWithoutTeacher']),
  },
  methods: {
    classClicked(lesson) {
      this.$router.push(`/acertos/${lesson._id}`)
    },
  },
  async fetch({ store }) {
    await store.dispatch('classrooms/find')
  },
};
</script>
