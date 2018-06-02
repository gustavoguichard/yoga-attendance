<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="person.displayName"
      :subtitle="person.displayName !== person.fullName ? person.fullName : null"
      :picture="person.picture"
    />
    <v-card class="main-card">
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
          <div class="summary__frequency">
            <h3 class="headline">Aulas: {{ result.length }}</h3>
            <v-list>
              <v-list-tile v-for="(items, title) in byClassRoom" :key="title">
                <v-list-tile-avatar class="avatar">
                  <img v-if="getTeacherPicture(items[0])" :src="getTeacherPicture(items[0])">
                  <v-icon v-else>person</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ title }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-chip class="frequency" outline color="primary">
                    {{ items.length }} ({{ fn.percent(items.length, result.length) }})
                  </v-chip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </div>
          <v-divider class="my-3 pt-2"></v-divider>
          <v-subheader class="pl-0">Pagamento:</v-subheader>
          <v-list dense two-line>
            <template v-for="(order, i) in paymentDescriptions">
              <v-divider v-if="i > 0"></v-divider>
              <payment-description :order="order" />
            </template>
          </v-list>
          <h4 class="headline calculated-payment">Pagamento calculado: <span>{{ fn.toMoney(fn.sumBy(paymentDescriptions, 'total')) }}</span></h4>
          <v-divider class="my-3 pt-2"></v-divider>
        </div>
      </v-card-title>
      <v-subheader>Presenças do mês:</v-subheader>
      <v-list two-line subheader>
        <div v-for="(item, i) in result" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="attendanceLink(item)">
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
import { get, groupBy, sumBy } from 'lodash'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import { percent, toMoney } from '@/utils/helpers'
import dateNavigator from '@/components/date-navigator'
import paymentDescription from '@/components/payment-description'
import pageTitle from '@/components/page-title'

export default {
  middleware: 'check-auth',
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle, paymentDescription },
  computed: {
    ...mapState('practitioners', ['person']),
    ...mapState('frequency', ['result']),
    ...mapState('payments', ['paymentDescriptions']),
    byClassRoom() {
      return groupBy(this.result, 'classroom.title')
    },
    fn() {
      return { parseDate, percent, sumBy, toMoney }
    },
  },
  methods: {
    attendanceLink(item) {
      return `/presencas/${item.classId}/${parseDate(item.createdAt, 'YYYY-MM-DD')}`
    },
    getTeacherPicture(item) {
      return get(item, 'classroom.teacherData.picture')
    },
  },
  async fetch({ store, params, query }) {
    await store.dispatch('practitioners/get', { id: params.id })
    await store.dispatch('payments/find', {
      query: {
        createdAt: getTimeRangeQuery('month', query.months),
        practitionerId: params.id,
      },
    })
    await store.dispatch('frequency/find', {
      query: {
        createdAt: getTimeRangeQuery('month', query.months),
        practitionerId: params.id,
        $limit: 10000,
      },
    })
  },
};
</script>

<style scoped>
.summary {
  width: 100%;
}

.calculated-payment span {
  font-weight: bold;
}

@media only screen and (max-width: 599px) {
  .card__title {
    padding: 16px 2px;
  }

  .summary__frequency .headline {
    padding: 5px 16px;
  }

  .avatar {
    min-width: auto;
  }

  .calculated-payment {
    padding: 10px;
    text-align: center;
  }
  .calculated-payment span {
    display: block;
  }
}
</style>
