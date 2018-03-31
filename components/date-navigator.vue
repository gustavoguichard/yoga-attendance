<template>
  <v-layout column>
    <span class="grey--text ml-2">{{ display }}{{ dateDisplay }}</span>
    <v-layout justify-space-between>
      <v-btn color="primary" :to="prevUnit">{{ prevLabel }}</v-btn>
      <v-btn v-if="prevUnit.query[`${unit}s`] > 1" color="primary" :to="nextUnit">{{ nextLabel }}</v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import { getStartOfDate, unitFromQuery } from '@/utils/date-helpers'

export default {
  props: ['display', 'format', 'unit', 'prevLabel', 'nextLabel'],
  computed: {
    currentUnit() {
      const { query } = this.$route
      return unitFromQuery(query[`${this.unit}s`])
    },
    dateDisplay() {
      return getStartOfDate(this.unit, this.currentUnit).format(this.format)
    },

    nextUnit() {
      return { query: { [`${this.unit}s`]: unitFromQuery(this.currentUnit, -1) } }
    },
    prevUnit() {
      return { query: { [`${this.unit}s`]: unitFromQuery(this.currentUnit, 1) } }
    },
  },
};
</script>
