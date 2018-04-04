<template>
  <v-layout align-content-center align-center column>
    <page-title :title="lesson.title" :subtitle="teacherName" />
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Selecione a lista pelo dia:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(item, i) in result.data" :key="i">
          <v-divider></v-divider>
          <v-list-tile ripple :to="`/presencas/${item._id}`">
            <v-list-tile-content>
              <v-list-tile-title>{{ parseDate(item) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.teacher.displayName }}</v-list-tile-sub-title>
            </v-list-tile-content>
             <v-list-tile-action>
                <v-list-tile-action-text>{{ item.practitioners.length }}</v-list-tile-action-text>
              </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <page-cta :to="`/chamada/${lesson._id}`" icon="playlist_add" />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { parseDate } from '@/utils/date-helpers'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'

export default {
  middleware: 'check-auth',
  components: { pageCta, pageTitle },
  computed: {
    ...mapState('frequency', ['result']),
    ...mapState('classrooms', ['lesson']),
    teacherName() {
      return get(this.lesson, 'teacher.displayName')
    },
  },
  methods: {
    parseDate({ createdAt }) {
      return parseDate(createdAt)
    },
  },
  async fetch({ store, query, params }) {
    await store.dispatch('classrooms/get', { id: params.id })
    await store.dispatch('frequency/find', {
      page: query.page,
      query: { classId: params.id },
    })
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
}
</style>
