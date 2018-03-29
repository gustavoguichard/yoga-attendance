<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>
          {{ lesson.title }}
          <span v-if="lesson.teacher"> - {{ lesson.teacher.fullName }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(person, name) in byPractitioner">
          <v-divider></v-divider>
          <v-list-tile avatar :key="name">
            <v-list-tile-avatar>
              <img v-if="person[0].picture" :src="'/' + person[0].picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ person[0].fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip>
                <v-avatar class="blue white-txt">{{ person.length }}</v-avatar>
                Aulas ({{ countPercent(person.length) }}%)
              </v-chip>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapGetters('frequency', ['byPractitioner']),
    ...mapState('practitioners', ['list']),
    ...mapState('classrooms', ['lesson']),
  },
  methods: {
    countPercent(length) {
      return parseInt((length * 100) / 15, 10)
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/find', {
      query: {
        classId: params.id,
        populatePractitioners: true,
      },
    })
    await store.dispatch('classrooms/get', params.id)
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
  width: 60%;
}
</style>