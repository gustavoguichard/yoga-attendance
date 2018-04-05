<template>
  <v-layout justify-center wrap>
    <practitioners-list @selected="selected" :editLink="true" :twoLine="true" />
    <page-cta icon="person_add" to="/praticantes/new" />
  </v-layout>
</template>

<script>
import api from '@/api'
import pageCta from '@/components/page-cta'
import practitionersList from '@/components/practitioners-list'

export default {
  middleware: 'check-auth',
  watchQuery: ['teacher', 'add_teacher'],
  components: { pageCta, practitionersList },
  methods: {
    async selected(person) {
      if (this.$route.query.add_teacher) {
        await api.service('practitioners').patch(person._id, { teacher: true })
        this.$router.push('/professores')
      } else {
        this.$router.push(`/praticantes/${person._id}`)
      }
    },
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
