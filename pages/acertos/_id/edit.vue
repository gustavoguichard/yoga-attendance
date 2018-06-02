<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person"
      :title="person.displayName"
      :subtitle="person.displayName !== person.fullName ? person.fullName : null"
      :picture="person.picture"
    />
    <v-card class="main-card">
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>
          {{ currentPayment.description.title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <h2>{{ fn.parseDate(currentPayment.createdAt, 'MMMM, YYYY') }}</h2>
      </v-card-title>
      <v-card-text>
        <p>
          <template v-if="currentPayment.description.discount">
            Valor: {{ fn.toMoney(currentPayment.description.value) }}
            <br>
            Desconto: {{ currentPayment.description.discount }}
            <i v-if="currentPayment.description.note"> - {{ currentPayment.description.note }}</i>
            <br>
            Valor final: {{ fn.toMoney(currentPayment.description.total) }}
          </template>
          <template v-else>Valor: {{ fn.toMoney(currentPayment.description.value) }}</template>
          <br>
          Quantidade: {{ currentPayment.frequented.length }}
        </p>
        <h3>Total: {{ fn.toMoney(currentPayment.total) }}</h3>
      </v-card-text>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field @keyup.enter="submit" v-model="editing.totalPaid" @blur="paid" label="Valor pago" name="totalPaid" prepend-icon="attach_money" required></v-text-field>
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
              <v-btn flat color="success" value="confirmed">
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
import { service } from '@/api'
import moment from 'moment'
import { includes } from 'lodash'
import { mapState } from 'vuex'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import paymentDescription from '@/components/payment-description'
import { parseDate } from '@/utils/date-helpers'
import { toMoney } from '@/utils/helpers'

export default {
  middleware: 'check-auth',
  components: { pageCta, pageTitle, paymentDescription },
  data: () => ({
    datePicker: false,
    paidAt: '',
    editing: {
      status: 'open',
      totalPaid: '',
      note: '',
    },
  }),
  computed: {
    ...mapState('payments', ['currentPayment']),
    prettyDate() {
      return parseDate(this.paidAt, 'DD/MM/YYYY')
    },
    person() {
      return this.currentPayment.practitioner
    },
    fn() {
      return { parseDate, toMoney }
    },
  },
  methods: {
    paid() {
      const isPaid = !includes(['open', 'pending'], this.editing.status)
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
      const { paidAt } = this
      const { status, totalPaid, note } = this.editing
      await service(this.$store, 'payments/patch', this.$route.params.id, {
        paidAt, status, totalPaid, note,
      })
      this.$router.push(`/praticantes/${this.person._id}`)
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('payments/get', {
      id: params.id,
    })
  },
  mounted() {
    this.editing = {
      ...this.editing,
      ...this.currentPayment,
    }
    this.changeDate(this.currentPayment.paidAt)
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
