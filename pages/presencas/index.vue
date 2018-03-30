<template>
  <v-layout align-content-center align-center column>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a lista pelo dia:</v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <v-layout column>
          <span class="grey--text ml-2">Semana do dia: {{ dayDisplay }}</span>
          <v-layout justify-space-between>
            <v-btn color="primary" :to="prevWeek">Semana anterior</v-btn>
            <v-btn v-if="weeks > 0" color="primary" :to="nextWeek">Próximo mês</v-btn>
          </v-layout>
        </v-layout>
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
import moment from 'moment'
import { get } from 'lodash'

const getWeekDate = (weeksAgo = 0) => moment().subtract(weeksAgo, 'week')

export default {
  middleware: 'check-auth',
  watchQuery: ['weeks'],
  computed: {
    ...mapState('frequency', ['result']),
    dayDisplay() {
      return getWeekDate(this.$route.query.weeks).startOf('week').format('DD/MM')
    },
    weeks() {
      return parseInt(this.$route.query.weeks, 10) || 0
    },
    prevWeek() {
      const weeks = this.weeks + 1
      return { query: { weeks } }
    },
    nextWeek() {
      const weeks = Math.max(this.weeks - 1, 0)
      return { query: { weeks } }
    },
  },
  methods: {
    parseDate({ createdAt }) {
      moment.locale('pt-BR')
      return moment(createdAt).format('ddd DD/MM/YYYY')
    },
    substitution(item) {
      return get(item, 'teacher._id') !== get(item, 'classRoom.teacher._id')
    },
  },
  async fetch({ store, query }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/find', {
      query: {
        createdAt: {
          $gte: getWeekDate(query.weeks).startOf('week')._d,
          $lt: getWeekDate(query.weeks).endOf('week')._d,
        },
        populateClassroom: true,
        $limit: 10000,
      },
    })
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