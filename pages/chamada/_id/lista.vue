<template>
  <v-layout align-content-center align-center column>
    <div class="text-xs-center grey--text text--darken-2 mb-4 mt-2">
      <h2 class="headline">{{ lesson.title }}</h2>
      <span class="subheading grey--text">{{ teacherName }}</span>
    </div>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a lista pelo dia:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item._id}`">
            <v-list-tile-content>
              <v-list-tile-title>{{ parseDate(item) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.teacher.displayName }}</v-list-tile-sub-title>
            </v-list-tile-content>
             <v-list-tile-action>
                <v-list-tile-action-text>{{ item.practitioners.length }}</v-list-tile-action-text>
              </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right :to="`/chamada/${lesson._id}`">
      <v-icon>playlist_add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { parseDate } from '@/utils/date-helpers'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapState('frequency', ['result']),
    ...mapState('classrooms', ['lesson']),
    teacherName() {
      return get(this.lesson, 'teacher.displayName')
    },
  },
  methods: {
    parseDate({ createdAt }) {
      return parseDate(createdAt)
    },
  },
  async fetch({ store, ...context }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', context.params.id)
    await store.dispatch('frequency/find', {
      page: context.query.page,
      query: { classId: context.params.id },
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