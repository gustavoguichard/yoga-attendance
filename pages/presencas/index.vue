<template>
  <v-layout align-content-center align-center column>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a lista pelo dia:</v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <date-navigator
          display="Semana do dia: "
          format="DD/MM"
          unit="week"
          prevLabel="Semana anterior"
          nextLabel="Próxima semana"
        />
      </v-card-title>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item._id}`">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ parseDate(item) }} <span class="grey--text text--darken-1">- {{ item.classRoom.title }}</span>
              </v-list-tile-title>
              <v-list-tile-sub-title v-if="item.classRoom.teacher && substitution(item)">
                {{ item.teacher.displayName }} - Substituindo: {{ item.classRoom.teacher.displayName }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title v-else>
                {{ item.teacher.displayName }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
             <v-list-tile-action>
                <v-list-tile-action-text>{{ item.practitioners.length }}</v-list-tile-action-text>
              </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right to="/">
      <v-icon>playlist_add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import dateNavigator from '@/components/date-navigator'


export default {
  middleware: 'check-auth',
  watchQuery: ['weeks'],
  components: { dateNavigator },
  computed: {
    ...mapState('frequency', ['result']),
  },
  methods: {
    parseDate({ createdAt }) {
      return parseDate(createdAt)
    },
    substitution(item) {
      return get(item, 'teacher._id') !== get(item, 'classRoom.teacher._id')
    },
  },
  async fetch({ store, query }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/find', {
      query: {
        createdAt: getTimeRangeQuery('week', query.weeks),
        populateClassroom: true,
        $limit: 10000,
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