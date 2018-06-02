<template>
  <v-list-tile :to="`/acertos/${order._id}/edit`" :class="`is-${order.status} order-tile`">
    <v-list-tile-content>
      <v-list-tile-title>{{ order.description.title }} - <span :class="{'old-value': isPaid}">{{ fn.toMoney(order.total) }}</span></v-list-tile-title>
      <v-list-tile-sub-title v-if="order.description.discount">
        <span class="old-value">{{ fn.toMoney(order.description.value) }}</span> - {{ order.description.discount }}
        <i v-if="order.description.note">{{ order.description.note }}</i>
      </v-list-tile-sub-title>
      <v-list-tile-sub-title v-if="isPaid">
        {{ fn.toMoney(order.totalPaid) }} - {{ fn.parseDate(order.paidAt) }}
        <i v-if="order.note"> - {{ order.note }}</i>
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <v-chip outline color="primary" v-if="order.frequented.length">
        {{ order.frequented.length }}
        <span v-if="order.description.amount" class="ml-1"> - {{ fn.percent(order.frequented.length, order.description.amount) }}</span>
      </v-chip>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { includes } from 'lodash'
import { percent, toMoney } from '@/utils/helpers'
import { parseDate } from '@/utils/date-helpers'

export default {
  props: ['order'],
  computed: {
    isPaid() {
      const { status } = this.order
      return !includes(['open', 'pending'], status)
    },
    fn() {
      return { parseDate, percent, toMoney }
    },
  },
}
</script>

<style scoped>
.old-value {
  text-decoration: line-through;
}

.order-tile {
  border-left: 6px solid lightslategrey;
}
.is-paid {
  border-left-color: lightskyblue;
}
.is-pending {
  border-left-color: orangered;
}
.is-confirmed {
  border-left-color: forestgreen;
}
</style>
