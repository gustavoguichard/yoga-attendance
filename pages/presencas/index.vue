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
        <div v-for="(item, classId) in frequencyByDate" :key="classId">
          <template v-for="(data, dateTitle) in item">
            <v-divider></v-divider>
            <v-list-tile ripple :to="`/presencas/${classId}/${dateTitle}`">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ fn.parseDate(dateTitle) }} <span class="grey--text text--darken-1">- {{ data.title }}</span>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ data.teacher }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ data.amount }}</v-list-tile-action-text>
                </v-list-tile-action>
            </v-list-tile>
          </template>
        </div>
      </v-list>
    </v-card>
    <page-cta icon="playlist_add" to="/" />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { reduce } from 'lodash'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import dateNavigator from '@/components/date-navigator'
import pageCta from '@/components/page-cta'

export default {
  middleware: 'check-auth',
  watchQuery: ['weeks'],
  components: { dateNavigator, pageCta },
  computed: {
    ...mapState('frequency', ['result']),
    frequencyByDate() {
      return reduce(this.result, (res, curr) => {
        const date = parseDate(curr.createdAt, 'YYYY-MM-DD')
        const prevDate = (res[curr.classId] && res[curr.classId][date]) || {}
        res[curr.classId] = {
          ...res[curr.classId],
          [date]: {
            teacher: curr.teacher ? curr.practitioner.displayName : prevDate.teacher,
            title: prevDate.title || curr.classroom.title,
            amount: (prevDate.amount || 0) + !curr.teacher,
          },
        }
        return res
      }, {})
    },
    fn() {
      return { parseDate }
    },
  },
  async fetch({ store, query }) {
    const { weeks, classId } = query
    await store.dispatch('frequency/find', {
      query: {
        classId,
        createdAt: getTimeRangeQuery('week', weeks),
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
