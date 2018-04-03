<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="person.displayName"
      :subtitle="person.displayName !== person.fullName ? person.fullName : null"
      :picture="person.picture"
    />
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Lista de presenças</v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <date-navigator
          format="MMMM YYYY"
          unit="month"
          prevLabel="Mês anterior"
          nextLabel="Próximo mês"
        />
      </v-card-title>
      <v-subheader>Resumo:</v-subheader>
      <v-card-title class="pt-0" primary-title>
        <div class="summary">
          <h3 class="headline">Aulas: {{ result.data.length }}</h3>
          <v-list>
            <v-list-tile v-for="(items, title) in byClassRoom" :key="title">
              <v-list-tile-avatar>
                <img v-if="getTeacherPicture(items[0])" :src="getTeacherPicture(items[0])">
                <v-icon v-else>person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ title }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-chip outline color="primary">
                  {{ items.length }} ({{ getPercent(items) }})
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <h4 class="subheading">Pagamento: {{ debth }}</h4>
        </div>
      </v-card-title>
      <v-subheader>Presenças do mês:</v-subheader>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item._id}`">
            <v-list-tile-content>
              <v-list-tile-title>{{ parseDate(item) }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ item.classRoom.title }}{{ item.teacher && ` - ${item.teacher.displayName}` }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get, groupBy, includes, map, replace, sum, toInteger } from 'lodash'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import { percent } from '@/utils/helpers'
import dateNavigator from '@/components/date-navigator'
import pageTitle from '@/components/page-title'

const values = { '1x': 130, '2x': 160, '3x': 200, '4x': 220, '5x': 250 }

export default {
  middleware: 'check-auth',
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle },
  computed: {
    ...mapState('practitioners', ['person']),
    ...mapState('frequency', ['result']),
    byClassRoom() {
      return groupBy(this.result.data, 'classRoom.title')
    },
    debth() {
      const { discount, family, attendances } = this.person
      const regular = map(attendances, x => toInteger(get(values, x) || x))
      const familyDiscount = family.length ? -10 : 0
      const off = includes(discount, '-')
        ? -toInteger(replace(discount, '-', ''))
        : 0
      const perc = includes(discount, '%') ? 100 - toInteger(replace(discount, '%', '')) : 100
      const value = ((sum(regular) + familyDiscount + off) * perc) / 100
      return `R$ ${value},00`
    },
  },
  methods: {
    getPercent(items) {
      return percent(items.length, this.result.data.length)
    },
    getTeacherPicture(item) {
      return get(item, 'classRoom.teacher.picture')
    },
    parseDate({ createdAt }) {
      return parseDate(createdAt)
    },
  },
  async fetch({ store, params, query }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('practitioners/get', { id: params.id })
    await store.dispatch('frequency/find', {
      query: {
        createdAt: getTimeRangeQuery('month', query.months),
        populateClassroom: true,
        practitioners: params.id,
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

  .summary {
    width: 100%;
  }
}
</style>