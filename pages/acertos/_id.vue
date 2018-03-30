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
        <template v-for="(person, id) in byPractitioner">
          <v-divider></v-divider>
          <v-list-tile avatar :key="id">
            <v-list-tile-avatar>
              <img v-if="person[0].picture" :src="'/' + person[0].picture" />
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

const timeRange = month => {
  const date = () => month === 'previous' ? moment().subtract(1, 'month') : moment()
  const range = { $gte: date().startOf('month')._d, $lt: date().endOf('month')._d }
  return range
}

export default {
  middleware: 'check-auth',
  computed: {
    ...mapState('frequency', ['result']),
    ...mapState('classrooms', ['lesson']),
    byPractitioner() {
      const { data } = this.result
      const list = filter(data, d => d.classId === this.lesson._id)
      const allFrequencies = flatten(map(list, 'practitioners'))
      return groupBy(allFrequencies, '_id')
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
    await store.dispatch('frequency/find', {
      query: {
        createdAt: timeRange(query.month),
        populatePractitioners: true,
        $limit: 10000,
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