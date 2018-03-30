<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>
          {{ lesson.title }}
          <span v-if="lesson.teacher"> - {{ lesson.teacher.fullName }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <v-layout column>
          <span class="grey--text ml-2">{{ monthDisplay }}</span>
          <v-layout justify-space-between>
            <v-btn color="primary" :to="prevMonth">Mês anterior</v-btn>
            <v-btn v-if="months > 0" color="primary" :to="nextMonth">Próximo mês</v-btn>
          </v-layout>
        </v-layout>
      </v-card-title>
      <v-list two-line>
        <template v-for="(person, id) in byPractitioner">
          <v-divider />
          <v-list-tile avatar :key="id">
            <v-list-tile-avatar>
              <img v-if="person[0].picture" :src="person[0].picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ person[0].fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip>
                <v-avatar class="blue white-txt">{{ classFrequency(person[0], true) }}</v-avatar>
                Aulas ({{ countPercent(person) }}%)
              </v-chip>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { flatten, filter, groupBy, includes, map, round } from 'lodash'
import moment from 'moment'

moment.locale('pt-BR')
const getMonthDate = (monthsAgo = 0) => moment().subtract(monthsAgo, 'month')

export default {
  middleware: 'check-auth',
  watchQuery: ['months'],
  computed: {
    ...mapState('frequency', ['result']),
    ...mapState('classrooms', ['lesson']),
    byPractitioner() {
      const { data } = this.result
      const list = filter(data, d => d.classId === this.lesson._id)
      const allFrequencies = flatten(map(list, 'practitioners'))
      return groupBy(allFrequencies, '_id')
    },
    monthDisplay() {
      return getMonthDate(this.$route.query.months).format('MMMM YYYY')
    },
    months() {
      return parseInt(this.$route.query.months, 10) || 0
    },
    prevMonth() {
      const months = this.months + 1
      return { query: { months } }
    },
    nextMonth() {
      const months = Math.max(this.months - 1, 0)
      return { query: { months } }
    },
  },
  methods: {
    classFrequency(person, fromLesson = false) {
      return filter(this.result.data, lesson => {
        const isPerson = includes(map(lesson.practitioners, '_id'), person._id)
        const isLesson = lesson.classId === this.lesson._id
        return isPerson && (!fromLesson || isLesson)
      }).length
    },
    countPercent(lessons) {
      const { length } = lessons
      const person = lessons[0]
      const total = this.classFrequency(person)
      return round((length * 100) / total)
    },
  },
  async fetch({ store, params, query }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', params.id)
    await store.dispatch('frequency/find', {
      query: {
        createdAt: {
          $gte: getMonthDate(query.months).startOf('month')._d,
          $lt: getMonthDate(query.months).endOf('month')._d,
        },
        populatePractitioners: true,
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