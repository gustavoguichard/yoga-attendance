<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="person.displayName"
      :subtitle="person.displayName !== person.fullName ? person.fullName : null"
      :avatar="person.avatar"
      :noMargin="true"
    />
    <v-btn :to="`/praticantes/${person._id}/edit?back_to=${$route.path}`" color="primary">Editar</v-btn>
    <v-card class="main-card">
      <v-toolbar>
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
            <h3 class="headline">Aulas: {{ frequency.length }}</h3>
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
                    {{ items.length }} ({{ fn.percent(items.length, frequency.length) }})
                  </v-chip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </div>
          <v-divider class="my-3 pt-2"></v-divider>
          <v-subheader class="pl-0">Pagamento:</v-subheader>
          <v-list dense two-line>
            <template v-for="(order, i) in payments">
              <v-divider v-if="i > 0"></v-divider>
              <payment-description :order="order" />
            </template>
          </v-list>
          <h4 class="headline calculated-payment">Pagamento calculado: <span>{{ fn.toMoney(fn.sumBy(payments, 'total')) }}</span></h4>
          <v-divider class="my-3 pt-2"></v-divider>
        </div>
      </v-card-title>
      <v-subheader>Presenças do mês:</v-subheader>
      <v-list two-line subheader>
        <div v-for="(item, i) in frequency" :key="i">
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
import { mapGetters } from 'vuex'
import { get, groupBy, sumBy } from 'lodash'
import fetchService from '@/api/fetch'
import { getTimeRangeQuery, parseDate } from '@/utils/date-helpers'
import { percent, toMoney } from '@/utils/helpers'
import dateNavigator from '@/components/date-navigator'
import paymentDescription from '@/components/payment-description'
import pageTitle from '@/components/page-title'

export default {
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle, paymentDescription },
  computed: {
    ...mapGetters({
      getPractitioner: 'practitioners/get',
      getClass: 'classrooms/get',
      findPayments: 'payments/findByTimeAgo',
      findFrequency: 'frequency/findByTimeAgo',
    }),
    byClassRoom() {
      return groupBy(this.frequency, 'classroom.title')
    },
    fn() {
      return { parseDate, percent, sumBy, toMoney }
    },
    frequency() {
      const { query, params } = this.$route
      const frequency = this.findFrequency({ unitsAgo: query.months, unit: 'month' }, {
        practitionerId: params.id,
      })
      return frequency.map(f => ({ ...f, classroom: this.getClass(f.classId) }))
    },
    payments() {
      const { query, params } = this.$route
      return this.findPayments({ unitsAgo: query.months, unit: 'month' }, {
        practitionerId: params.id,
      })
    },
    person() {
      return this.getPractitioner(this.$route.params.id)
    },
  },
  methods: {
    attendanceLink(item) {
      return `/presencas/${item.classId}/${parseDate(item.createdAt, 'YYYY-MM-DD')}`
    },
    getTeacherPicture(item) {
      return get(item, 'classroom.teacherData.avatar')
    },
  },
  async fetch({ store, query }) {
    const createdAt = getTimeRangeQuery('month', query.months)
    await fetchService('practitioners')(store)
    await fetchService('classrooms')(store)
    await fetchService('payments')(store, { createdAt }, query.months)
    await fetchService('frequency')(store, { createdAt }, query.months)
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
