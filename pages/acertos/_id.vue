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
        <date-navigator
          format="MMMM YYYY"
          unit="month"
          prevLabel="Mês anterior"
          nextLabel="Próximo mês"
        />
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
              <v-list-tile-title>
                <span v-if="person[0].nickName">
                  {{ person[0].nickName }}
                  <em class="grey--text"> - {{ person[0].fullName }}</em>
                </span>
                <span v-else>{{ person[0].fullName }}</span>
              </v-list-tile-title>
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
import { getTimeRangeQuery } from '@/utils/date-helpers'
import dateNavigator from '@/components/date-navigator'

export default {
  middleware: 'check-auth',
  watchQuery: ['months'],
  components: { dateNavigator },
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
      const total = this.classFrequency(lessons[0])
      return round((lessons.length / total) * 100)
    },
  },
  async fetch({ store, params, query }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', params.id)
    await store.dispatch('frequency/find', {
      query: {
        createdAt: getTimeRangeQuery('month', query.months),
        populatePractitioners: true,
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