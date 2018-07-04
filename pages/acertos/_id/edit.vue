<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="person.displayName"
      :subtitle="person.displayName !== person.fullName ? person.fullName : null"
      :avatar="person.avatar"
    />
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>
          {{ payment.description.title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <h2>{{ fn.parseDate(payment.createdAt, 'MMMM, YYYY') }}</h2>
      </v-card-title>
      <v-card-text>
        <p>
          <template v-if="payment.description.discount">
            Valor: {{ fn.toMoney(payment.description.value) }}
            <br>
            Desconto: {{ payment.description.discount }}
            <i v-if="payment.description.note"> - {{ payment.description.note }}</i>
            <br>
            Valor final: {{ fn.toMoney(payment.description.total) }}
          </template>
          <template v-else>Valor: {{ fn.toMoney(payment.description.value) }}</template>
          <br>
          Quantidade: {{ payment.frequented.length }}
        </p>
        <h3>Total: {{ fn.toMoney(editing.total) }}</h3>
      </v-card-text>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field v-if="isAdmin" @keyup.enter="submit" v-model="editing.total" label="Valor total" name="total" prepend-icon="attach_money" required></v-text-field>
            <v-text-field @keyup.enter="submit" v-model="editing.totalPaid" @blur="paid" label="Valor pago" name="totalPaid" prepend-icon="money_off" required></v-text-field>
            <v-text-field @keyup.enter="submit" v-model="editing.note" label="Observação" name="note" prepend-icon="note_add"></v-text-field>
            <v-dialog
              ref="dialog"
              v-model="datePicker"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                @focus="datePicker = true"
                v-model="prettyDate"
                label="Data de recebimento"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="paidAt" locale="pt-br" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="datePicker = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="changeDate(paidAt)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
            <v-btn-toggle v-model="editing.status" mandatory>
              <v-btn flat value="open">
                Aberto
              </v-btn>
              <v-btn flat color="warning" value="pending">
                Pendente
              </v-btn>
              <v-btn flat color="primary" value="paid">
                Pago
              </v-btn>
              <v-btn v-if="isAdmin" flat color="success" value="confirmed">
                Confirmado
              </v-btn>
            </v-btn-toggle>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <page-cta @click="submit" icon="check" />
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import moment from 'moment'
import { mapGetters } from 'vuex'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import paymentDescription from '@/components/payment-description'
import { parseDate } from '@/utils/date-helpers'
import { toMoney } from '@/utils/helpers'

export default {
  components: { pageCta, pageTitle, paymentDescription },
  data: () => ({
    datePicker: false,
    paidAt: '',
    editing: {
      status: 'open',
      totalPaid: '',
      total: '',
      note: '',
    },
  }),
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    ...mapGetters('payments', ['get']),
    payment() {
      return this.get(this.$route.params.id)
    },
    prettyDate() {
      return parseDate(this.paidAt, 'DD/MM/YYYY')
    },
    person() {
      return this.payment.practitioner
    },
    fn() {
      return { parseDate, toMoney }
    },
  },
  methods: {
    paid() {
      const isPaid = !['open', 'pending'].includes(this.editing.status)
      if (this.editing.totalPaid && !isPaid) {
        this.editing.status = 'paid'
      } else if (!this.editing.totalPaid) {
        this.editing.status = 'pending'
      }
    },
    changeDate(date) {
      this.paidAt = moment(date).format('YYYY-MM-DD')
      this.datePicker = false
    },
    async submit() {
      const paidAt = moment(this.paidAt)._d
      const { status, total, totalPaid, note } = this.editing
      const _id = this.$route.params.id
      await new this.$FeathersVuex.Payment({ _id, paidAt, status, total, totalPaid, note }).save()
      this.$router.push(this.$route.query.back_to || `/praticantes/${this.person._id}`)
    },
  },
  async fetch({ store }) {
    await fetchService('payments')(store)
  },
  mounted() {
    const payment = new this.$FeathersVuex.Payment(this.payment)
    this.editing = payment.clone()
    this.changeDate(this.payment.paidAt)
  },
};
</script>

<style scoped>
@media only screen and (max-width: 599px) {
  .btn-toggle {
    display: inline-block;
  }
}
</style>
