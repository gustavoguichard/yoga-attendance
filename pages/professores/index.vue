<template>
  <v-layout justify-center wrap>
    <practitioners-list v-if="chooseList" title="Escolha o praticante" @selected="selected" :query="{ teacher: false }" />
    <practitioners-list v-else title="Professores" to="/praticantes/:id" :twoLine="true" :query="{ teacher: true }" />
    <page-cta :icon="chooseList ? 'arrow_back' : 'person_add'" @click.stop="toggleChooseList" />
  </v-layout>
</template>

<script>
import pageCta from '@/components/page-cta'
import practitionersList from '@/components/practitioners-list'

export default {
  middleware: 'check-auth',
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
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/patch', { _id, teacher: true })
      this.$router.push({ query: null })
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