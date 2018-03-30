<template>
  <v-layout align-content-center align-center column>
    <div class="text-xs-center grey--text text--darken-2 mb-4 mt-2">
      <v-avatar class="mb-2" size="100">
        <img v-if="peopleList.classRoom.teacher.picture" :src="peopleList.classRoom.teacher.picture" alt="Professor" />
        <v-icon v-else>person</v-icon>
      </v-avatar>
      <h2 class="headline">{{ peopleList.classRoom.title }}</h2>
      <span v-if="substitution(peopleList)" class="subheading grey--text">Substituto: {{ peopleList.teacher.displayName }}</span>
    </div>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(person, i) in peopleList.practitioners" :key="i">
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img v-if="person.picture" :src="person.picture" alt="Professor" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ person.displayName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapState('frequency', ['peopleList']),
  },
  methods: {
    substitution(item) {
      return get(item, 'teacher._id') !== get(item, 'classRoom.teacher._id')
    },
  },
  async fetch({ store, ...context }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/get', {
      id: context.params.id,
      query: {
        populatePractitioners: true,
        populateClassroom: true,
      },
    })
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
}
</style>