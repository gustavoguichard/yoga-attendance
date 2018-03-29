<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>{{ lesson.title }} <br> {{ teacherName }}</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple @click.native="">
            <v-list-tile-content>
              <v-list-tile-title>{{ parseDate(item) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.teacher.fullName }}</v-list-tile-sub-title>
            </v-list-tile-content>
             <v-list-tile-action>
                <v-list-tile-action-text>{{ item.practitioners.length }}</v-list-tile-action-text>
              </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right :to="`/chamada/${lesson._id}`">
      <v-icon>playlist_add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapState('frequency', ['result']),
    ...mapState('classrooms', ['lesson']),
    teacherName() {
      const { teacher } = this.lesson
      return teacher ? teacher.fullName : null
    },
  },
  methods: {
    parseDate({ createdAt }) {
      moment.locale('pt-BR')
      return moment(createdAt).format('ddd DD/MM/YYYY')
    },
  },
  async fetch({ store, ...context }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', context.params.id)
    await store.dispatch('frequency/find', {
      page: context.query.page,
      query: { classId: context.params.id },
    })
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
}
</style>