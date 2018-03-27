<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a turma pelo professor</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in classByTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-tile avatar :key="teacher.name" @click="">
            <v-list-tile-avatar>
              <v-icon>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ teacher.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile v-for="lesson in teacher.classes" :key="lesson.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ lesson.title }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="lesson.description" v-html="lesson.description" />
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Outras turmas</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(room, i) in classWithoutTeacher">
          <v-list-tile avatar :key="room.title" @click="">
            <v-list-tile-avatar>
              <v-icon>group</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ room.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapGetters('classrooms', ['classByTeacher', 'classWithoutTeacher']),
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/fetch')
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
}
</style>