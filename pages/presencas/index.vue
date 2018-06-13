<template>
  <v-layout align-content-center align-center column>
    <v-card class="main-card">
      <v-toolbar>
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
        <div v-for="(item, index) in frequencyByDate" :key="index">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item.classId}/${item.date}`">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ fn.parseDate(item.date) }} <span class="grey--text text--darken-1">- {{ item.title }}</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ item.teacher }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.amount }}</v-list-tile-action-text>
              </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <page-cta icon="playlist_add" to="/" />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { map, groupBy } from 'lodash'
import { sortByKey } from '@/utils/helpers'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import fetchService from '@/api/fetch'
import dateNavigator from '@/components/date-navigator'
import pageCta from '@/components/page-cta'

export default {
  watchQuery: ['weeks'],
  components: { dateNavigator, pageCta },
  computed: {
    ...mapGetters({ findFrequency: 'frequency/findByTimeAgo' }),
    frequency() {
      const { query } = this.$route
      const searchQuery = query.classId ? { classId: query.classId } : undefined
      return this.findFrequency({ unitsAgo: query.weeks, unit: 'week' }, searchQuery)
    },
    frequencyByDate() {
      const withDate = map(this.frequency, f => ({ ...f, date: parseDate(f.createdAt, 'YYYY-MM-DD') }))
      const grouped = groupBy(withDate, item => `${item.date}_${item.classId}`)
      const sorted = sortByKey(grouped, true)
      return map(sorted, curr => {
        const withTeacher = curr.find(c => c.teacher) || curr[0]
        return {
          date: withTeacher.date,
          classId: withTeacher.classId,
          title: withTeacher.classroom.title,
          teacher: withTeacher.practitioner.displayName,
          amount: curr.length - 1,
        }
      })
    },
    fn() {
      return { parseDate }
    },
  },
  async fetch({ store, query }) {
    const createdAt = getTimeRangeQuery('week', query.weeks)
    await fetchService('frequency')(store, { createdAt }, query.weeks)
  },
};
</script>
