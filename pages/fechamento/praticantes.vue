<template>
  <v-layout align-content-center align-center column>
    <page-title
      title="Fechamento Mensal"
      subtitle="Aulas Regulares"
    />
    <v-card class="main-card">
      <v-toolbar>
        <v-text-field ref="search" @keyup.esc="clearSearch" @keydown.native.enter="clearSearch" v-model="filter" class="mx-4" label="Buscar" hide-details single-line></v-text-field>
        <v-btn icon dark>
          <v-icon>search</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>
        <date-navigator
          format="MMMM YYYY"
          unit="month"
          prevLabel="Mês anterior"
          nextLabel="Próximo mês"
        />
      </v-card-title>
      <v-divider />
      <v-list two-line>
        <template v-for="(item, i) in people">
          <v-divider v-if="i > 0" />
          <v-list-tile ripple avatar :to="`/praticantes/${item.person._id}?months=${$route.query.months}`">
            <v-list-tile-avatar size="28">
              <img :src="item.person.avatar" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span>
                  {{ item.person.displayName }}
                  <em class="grey--text"> - {{ item.person.surname }}</em>
                </span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                <v-chip outline small color="primary">
                  Aulas: {{ item.total }}
                </v-chip>
                <v-chip v-for="(payment, i) in item.payment" :key="i" light small :color="statusColor(payment)">
                  {{ payment.status === 'open' ? 'Pagamento Aberto' : fn.toMoney(payment.totalPaid) }}
                </v-chip>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="toConfirm(item) && toConfirm(item).status !== 'confirmed'">
              <v-btn icon @click.prevent="confirmPayments(item)">
                <v-icon color="green">check_circle</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import fetchService from '@/api/fetch'
import { get, map, groupBy } from 'lodash'
import { getTimeRangeQuery } from '@/utils/date-helpers'
import { searchInFields, sortByKey, toMoney } from '@/utils/helpers'
import dateNavigator from '@/components/date-navigator'
import pageTitle from '@/components/page-title'

export default {
  middleware: ['check-admin'],
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle },
  data: () => ({ filter: '' }),
  computed: {
    ...mapGetters({
      getPractitioner: 'practitioners/get',
      findPayments: 'payments/findByTimeAgo',
      findFrequency: 'frequency/findByTimeAgo',
    }),
    frequency() {
      const { query } = this.$route
      const frequency = this.findFrequency({ unitsAgo: query.months, unit: 'month' }, {
        teacher: false,
        'classroom.regularClass': true,
      })
      const grouped = groupBy(frequency, item => `${get(item, 'practitioner.displayName')}_${item.practitionerId}`)
      const sorted = sortByKey(grouped)
      const result = map(sorted, freq => {
        const person = freq[0].practitioner
        const payments = this.findPayments({ unitsAgo: query.months, unit: 'month' }, {
          regularClass: true,
          practitionerId: freq[0].practitionerId,
        })
        const payment = payments.map(({ _id, totalPaid, status, note }) =>
          ({ _id, totalPaid, status, note })
        )
        return { person, payment, total: freq.length }
      })
      return result
    },
    people() {
      const filterBlanks = this.frequency.filter(f => f.person)
      return searchInFields(filterBlanks, ['person.displayName', 'person.surname'], this.filter)
    },
    fn() {
      return { toMoney }
    },
  },
  methods: {
    ...mapActions('payments', ['patch']),
    clearSearch() {
      this.filter = ''
    },
    toConfirm({ payment }) {
      return payment.find(p => p.status === 'paid') || payment[0]
    },
    async confirmPayments(item) {
      const payment = this.toConfirm(item)
      if (payment.status === 'paid') {
        await this.patch([payment._id, { status: 'confirmed' }])
        this.$store.dispatch('notification/success', 'Pagamento confirmado!')
      } else {
        this.$router.push(`/acertos/${payment._id}/edit?back_to=${this.$route.fullPath}`)
      }
    },
    statusColor({ status }) {
      return get({ pending: 'red', paid: 'blue', confirmed: 'green' }, status, 'lightslategrey')
    },
  },
  async fetch({ store, query }) {
    const createdAt = getTimeRangeQuery('month', query.months)
    await fetchService('practitioners')(store)
    await fetchService('payments')(store, { createdAt }, true)
    await fetchService('frequency')(store, { createdAt }, query.months)
  },
};
</script>
