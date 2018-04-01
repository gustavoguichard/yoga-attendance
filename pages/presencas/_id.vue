<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="peopleList.classRoom.title"
      :subtitle="substitution(peopleList) && `Substituto: ${peopleList.teacher.displayName}`"
      :picture="peopleList.classRoom.teacher.picture"
    />
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(person, i) in peopleList.practitioners" :key="i">
          <v-divider></v-divider>
          <person-list-item v-if="isSubscribed(person)" :avatar="true" :person="person" property="displayName" :disabled="true" />
          <person-list-item v-else :avatar="true" :person="person" property="displayName" :disabled="true">
            <v-icon slot="right" color="orange darken-4">compare_arrows</v-icon>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get, includes } from 'lodash'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'

export default {
  middleware: 'check-auth',
  components: { pageTitle, personListItem },
  computed: {
    ...mapState('frequency', ['peopleList']),
  },
  methods: {
    isSubscribed({ classRooms }) {
      return includes(classRooms, this.peopleList.classId)
    },
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