<template>
  <v-layout justify-center wrap>
    <practitioners-list v-if="chooseList" title="Escolha o praticante" @selected="selected" :query="{ teacher: false }" :chooseList="true" :twoLine="true" />
    <practitioners-list v-else title="Professores" to="/praticantes/:id" :twoLine="true" :query="{ teacher: true }" />
    <page-cta :icon="chooseList ? 'arrow_back' : 'person_add'" @click.stop="toggleChooseList" />
  </v-layout>
</template>

<script>
import { service } from '@/api'
import pageCta from '@/components/page-cta'
import practitionersList from '@/components/practitioners-list'
import { fetchPractitioners } from '@/api/fetch'

export default {
  middleware: ['check-admin'],
  watchQuery: ['add'],
  components: { pageCta, practitionersList },
  computed: {
    chooseList() {
      return !!this.$route.query.add
    },
  },
  methods: {
    toggleChooseList() {
      const query = this.chooseList ? null : { add: 'teacher' }
      this.$router.push({ query })
    },
    async selected({ _id }) {
      await service(this.$store, 'practitioners/patch', _id, { teacher: true })
      this.$router.push({ query: null })
    },
  },
  async fetch({ store }) {
    await fetchPractitioners(store)
  },
};
</script>
