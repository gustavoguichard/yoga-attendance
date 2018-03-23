<template>
  <main class="classrooms">
    <h1>Classroooms</h1>
    <p v-for="(teacher, i) in classByTeacher">
      {{teacher.name}}
      <ul>
        <li v-for="room in teacher.classes">{{room.title}}</li>
      </ul>
    </p>
  </main>
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
