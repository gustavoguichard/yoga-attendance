<template>
  <v-layout justify-center wrap>
    <practitioners-list :to="'/praticantes/:id'" :editLink="true" :twoLine="true" />
    <page-cta icon="person_add" to="/praticantes/new" />
  </v-layout>
</template>

<script>
import { fetchPractitioners } from '@/api/fetch'
import pageCta from '@/components/page-cta'
import practitionersList from '@/components/practitioners-list'

export default {
  components: { pageCta, practitionersList },
  async fetch({ store }) {
    await fetchPractitioners(store)
  },
};
</script>
