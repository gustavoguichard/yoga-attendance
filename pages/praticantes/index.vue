<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Praticantes</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <template v-for="person in list">
          <person-list-item :avatar="true" avatarSize="28" :person="person" @click="clicked(person)" />
          <v-divider />
        </template>
      </v-list>
    </v-card>
    <page-cta icon="person_add" to="/praticantes/new" />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { pick } from 'lodash'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'

export default {
  middleware: 'check-auth',
  watchQuery: ['teacher', 'add_teacher'],
  components: { pageCta, personListItem },
  computed: {
    ...mapState('practitioners', ['list']),
  },
  methods: {
    async clicked(person) {
      if (this.$route.query.add_teacher) {
        await this.$store.dispatch('auth/ensureAuth')
        await this.$store.dispatch('practitioners/patch', {
          _id: person._id,
          teacher: true,
        })
        this.$router.push('/professores')
      } else {
        this.$router.push(`/praticantes/${person._id}`)
      }
    },
  },
  async fetch({ store, query }) {
    await store.dispatch('auth/ensureAuth')
    const filteredQuery = pick(query, 'teacher')
    await store.dispatch('practitioners/find', { query: filteredQuery })
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