<template>
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
              Aulas: {{ item.frequency ? `${item.frequency} / ${item.total}` : item.total }}
              <span v-if="item.frequency && item.frequency !== item.total" class="ml-2">({{ fn.percent(item.frequency, item.total) }})</span>
            </v-chip>
            <v-chip v-for="(payment, i) in item.payment" :key="i" light small :color="statusColor(payment)">
              {{ payment.status === 'open' || payment.status === 'pending' ? `Pagamento Aberto: ${fn.toMoney(payment.total)}` : fn.toMoney(payment.totalPaid) }}
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
</template>

<script>
import { get } from 'lodash'
import { percent, toMoney } from '@/utils/helpers'
import { mapActions } from 'vuex'

export default {
  props: ['list'],
  computed: {
    people() {
      return this.list.filter(p => p.person)
    },
    fn() {
      return { percent, toMoney }
    },
  },
  methods: {
    ...mapActions('payments', ['patch']),
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
};
</script>