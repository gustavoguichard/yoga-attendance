<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-btn icon @click="selectAll">
          <v-icon v-if="allSelected" color="yellow">group</v-icon>
          <v-icon v-else>group_add</v-icon>
        </v-btn>
        <v-toolbar-title>Praticantes da turma</v-toolbar-title>
      </v-toolbar>
      <v-list dense subheader>
        <div v-for="(people, letter) in practitionersByLetter" :key="letter">
          <v-divider></v-divider>
          <v-subheader>{{ letter }}</v-subheader>
          <v-divider></v-divider>
          <v-list-tile avatar v-for="person in people" :key="person.fullName" ripple @click="toggle(person)">
            <v-list-tile-action>
              <v-icon v-if="isSelected(person)" color="blue darken-2">person</v-icon>
              <v-icon v-else color="grey lighten-1">person_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ person.fullName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Professor</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <div v-for="(teacher, i) in teachers" :key="teacher._id">
          <v-divider v-if="i > 0"></v-divider>
          <v-list-tile avatar ripple @click="selectTeacher(teacher)">
            <v-list-tile-avatar>
              <img v-if="teacher.picture" :src="'/' + teacher.picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ teacher.fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="isTeacher(teacher)" color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right @click="submit()">
      <v-icon>done_all</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { concat, findIndex, map, uniq, without } from 'lodash'

export default {
  middleware: 'check-auth',
  data() {
    return {
      selected: [],
      currentTeacher: undefined,
    }
  },
  methods: {
    toggle(person) {
      const fn = this.isSelected(person) ? without : concat
      const newList = fn(this.selected, person._id)
      this.selected = uniq(newList)
    },
    isSelected(person) {
      const index = findIndex(this.selected, id => id === person._id)
      return index >= 0
    },
    selectAll() {
      this.selected = this.allSelected ? [] : map(this.list, '_id')
    },
    selectTeacher(teacher) {
      this.currentTeacher = teacher
    },
    isTeacher(teacher) {
      return teacher._id === this.teacher._id
    },
    async submit() {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('classrooms/addAttendance', {
        practitioners: this.selected,
        teacher: this.teacher._id,
        classId: this.lesson._id,
      })
      this.$router.push('/')
    },
  },
  computed: {
    ...mapGetters('practitioners', ['practitionersByLetter', 'teachers']),
    ...mapState('practitioners', ['list']),
    ...mapState('classrooms', ['lesson']),
    allSelected() {
      return this.list.length === this.selected.length
    },
    teacher() {
      return this.currentTeacher || this.lesson.teacher || { id: null }
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', params.id)
    await store.dispatch('practitioners/find')
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
}
</style>