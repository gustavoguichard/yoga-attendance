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
      <people-payment :list="people" />
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import fetchService from '@/api/fetch'
import { getTimeRangeQuery } from '@/utils/date-helpers'
import { searchInFields } from '@/utils/helpers'
import { formattedFrequency } from '@/utils/payment-helpers'
import dateNavigator from '@/components/date-navigator'
import pageTitle from '@/components/page-title'
import peoplePayment from '@/components/people-payment'

export default {
  middleware: ['check-admin'],
  watchQuery: ['months'],
  components: { dateNavigator, pageTitle, peoplePayment },
  data: () => ({ filter: '' }),
  computed: {
    ...mapGetters({
      findPayments: 'payments/find',
      findFrequency: 'frequency/findByTimeAgo',
    }),
    frequency() {
      const { query } = this.$route
      const frequency = this.findFrequency({ unitsAgo: query.months, unit: 'month' }, {
        teacher: false,
        'classroom.regularClass': true,
      })
      return formattedFrequency(frequency, this.findPayments, query.months)
    },
    people() {
      return searchInFields(this.frequency, ['person.displayName', 'person.surname'], this.filter)
    },
  },
  methods: {
    ...mapActions('payments', ['patch']),
    clearSearch() {
      this.filter = ''
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
