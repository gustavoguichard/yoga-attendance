<template>
  <v-dialog ref="dialog" v-model="datePicker" lazy full-width width="290px">
    <v-text-field slot="activator" v-model="prettyDate" :label="label" prepend-icon="event" readonly />
    <v-date-picker v-model="rawDate" locale="pt-br" scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="datePicker = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="changeDate">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
import { parseDate, unparseDate } from '@/utils/date-helpers'

export default {
  props: {
    date: { type: String },
    label: { type: String, default: 'Alterar data' },
    format: { type: String, default: 'DD/MM/YYYY' },
  },
  data: () => ({
    datePicker: false,
    rawDate: undefined,
  }),
  computed: {
    prettyDate() {
      return parseDate(this.rawDate, this.format)
    },
  },
  methods: {
    changeDate() {
      this.datePicker = false
      const date = unparseDate(this.rawDate)
      this.$emit('change', date, this.rawDate)
    },
  },
  mounted() {
    this.rawDate = this.date
  },
};
</script>
