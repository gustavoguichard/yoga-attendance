<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>
          {{ lesson.title }}
          <span v-if="lesson.teacher"> - {{ lesson.teacher.fullName }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(person, name) in byPractitioner">
          <v-divider></v-divider>
          <v-list-tile avatar :key="name">
            <v-list-tile-avatar>
              <img v-if="person[0].picture" :src="'/' + person[0].picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ person[0].fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip>
                <v-avatar class="blue white-txt">{{ person.length }}</v-avatar>
                Aulas ({{ countPercent(person) }}%)
              </v-chip>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { find, map } from 'lodash'
import api from '@/api'
import moment from 'moment'

// const lastMonthStart = moment().subtract(1, 'month').startOf('month')
const lastMonthStart = moment().startOf('month')
// const lastMonthEnd = moment().subtract(1, 'month').endOf('month')
const lastMonthEnd = moment().endOf('month')

export default {
  middleware: 'check-auth',
  data: () => ({
    frequencyById: [],
  }),
  computed: {
    ...mapGetters('frequency', ['byPractitioner']),
    ...mapState('practitioners', ['list']),
    ...mapState('classrooms', ['lesson']),
  },
  methods: {
    countPercent(personArray) {
      if (this.frequencyById.length) {
        const { length } = personArray
        const person = personArray[0]
        const result = find(this.frequencyById, f => f._id === person._id)
        return parseInt((length * 100) / result.total, 10)
      }
      return 100
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/find', {
      query: {
        classId: params.id,
        createdAt: {
          $gte: lastMonthStart._d,
          $lt: lastMonthEnd._d,
        },
        populatePractitioners: true,
      },
    })
    await store.dispatch('classrooms/get', params.id)
  },
  async mounted() {
    await this.$store.dispatch('auth/ensureAuth')
    const totalById = await Promise.all(map(this.byPractitioner, async lessons => {
      const { _id } = lessons[0]
      const frequency = await api.service('frequency').find({
        query: {
          practitioners: _id,
          createdAt: {
            $gte: lastMonthStart._d,
            $lt: lastMonthEnd._d,
          },
        },
      })
      return { _id, total: frequency.total }
    }))
    this.frequencyById = totalById
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
  width: 60%;
}
</style>