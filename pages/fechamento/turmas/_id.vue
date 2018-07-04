<template>
  <v-layout align-content-center align-center column>
    <page-title
      :title="lesson.title"
      :subtitle="lesson.teacherData && lesson.teacherData.displayName"
      :avatar="lesson.teacherData && lesson.teacherData.avatar"
    />
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Praticantes</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-list two-line>
      </v-list>
      <v-divider />
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import fetchService from '@/api/fetch'
import { getTimeRangeQuery } from '@/utils/date-helpers'
import classTile from '@/components/class-tile'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'

export default {
  middleware: ['check-admin'],
  components: { classTile, pageTitle, personListItem },
  computed: {
    ...mapGetters({
      getLesson: 'classrooms/get',
    }),
    lesson() {
      return this.getLesson(this.$route.params.id)
    },
  },
  async fetch({ store, query }) {
    const createdAt = getTimeRangeQuery('month', query.months)
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
    await fetchService('frequency')(store, { createdAt }, query.months)
  },
};
</script>
