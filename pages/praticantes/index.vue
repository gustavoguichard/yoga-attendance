<template>
  <v-layout align-content-center align-center column>
    <page-title
      title="Praticantes"
      icon="group"
    />
    <practitioners-list :to="'/praticantes/:id'" :editLink="true" :twoLine="true" />
    <page-cta icon="person_add" to="/praticantes/new" />
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import practitionersList from '@/components/practitioners-list'

export default {
  components: { pageCta, pageTitle, practitionersList },
  async fetch({ store }) {
    await fetchService('practitioners')(store)
  },
};
</script>
