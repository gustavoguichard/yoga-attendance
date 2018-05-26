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
                  {{ items.length }} ({{ fn.percent(items.length, result.data.length) }})
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider class="my-3 pt-2"></v-divider>
          <v-subheader class="pl-0">Pagamento:</v-subheader>
          <v-list dense two-line>
            <template v-for="(desc, i) in paymentDescription.detailing">
              <v-divider v-if="i > 0"></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ desc.title }} - {{ fn.toMoney(desc.total) }}</v-list-tile-title>
                  <v-list-tile-sub-title v-if="desc.discount">
                    <span class="old-value">{{ fn.toMoney(desc.value) }}</span> - {{ desc.discount }}
                    <i v-if="desc.note">{{ desc.note }}</i>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                <v-chip outline color="primary" v-if="desc.frequented !== undefined">
                  {{ desc.frequented }}
                  <span v-if="desc.amount" class="ml-1"> - {{ fn.percent(desc.frequented, desc.amount) }}</span>
                </v-chip>
                <v-chip outline color="primary" v-else-if="desc.date">
                  {{ fn.parseDate(desc.date, 'ddd DD/MM') }}
                </v-chip>
              </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
          <h4 class="headline">Pagamento calculado: {{ fn.toMoney(paymentDescription.total) }}</h4>
          <v-divider class="my-3 pt-2"></v-divider>
        </div>
      </v-card-title>
      <v-subheader>Presenças do mês:</v-subheader>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item._id}`">
            <v-list-tile-content>
              <v-list-tile-title>{{ fn.parseDate(item.createdAt) }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ item.classroom.title }}{{ item.teacher ? ` - como professor` : '' }}
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
import { get, groupBy } from 'lodash'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import { percent, toMoney } from '@/utils/helpers'
import dateNavigator from '@/components/date-navigator'
import pageTitle from '@/components/page-title'

export default {
  middleware: 'check-auth',
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle },
  computed: {
    ...mapState('practitioners', ['person']),
    ...mapState('frequency', ['result']),
    ...mapState('payments', ['currentDescription']),
    byClassRoom() {
      return groupBy(this.result.data, 'classroom.title')
    },
    paymentDescription() {
      return this.currentDescription.paymentDescription
    },
    fn() {
      return { parseDate, percent, toMoney }
    },
  },
  methods: {
    getTeacherPicture(item) {
      return get(item, 'classroom.teacher.picture')
    },
  },
  async fetch({ store, params, query }) {
    await store.dispatch('practitioners/get', { id: params.id,
      query: { populateEnrollments: true },
    })
    await store.dispatch('payments/get', { id: params.id,
      query: { months: query.months },
    })
    await store.dispatch('frequency/find', {
      query: {
        createdAt: getTimeRangeQuery('month', query.months),
        populateClassroom: true,
        practitionerId: params.id,
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

  .old-value {
    text-decoration: line-through;
  }
}
</style>
