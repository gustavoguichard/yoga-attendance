<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a turma pelo professor</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in classByTeacher">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-tile avatar :key="teacher.name">
            <v-list-tile-avatar>
              <img v-if="teacher.picture" :src="teacher.picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ teacher.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <class-tile v-for="lesson in teacher.classes" :key="lesson.title" :lesson="lesson"></class-tile>
        </template>
      </v-list>
    </v-card>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Outras turmas</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <class-tile v-for="lesson in classWithoutTeacher" :key="lesson.title" :lesson="lesson"></class-tile>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import classTile from '@/components/class-tile.vue'

export default {
  middleware: 'check-auth',
  components: { classTile },
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