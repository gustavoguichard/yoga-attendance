<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Praticantes</v-toolbar-title>
      </v-toolbar>
      <v-list dense subheader>
        <div v-for="(people, letter) in practitionersByLetter" :key="letter">
          <v-divider></v-divider>
          <v-subheader>{{ letter }}</v-subheader>
          <v-divider></v-divider>
          <v-list-tile v-for="person in people" :key="person.fullName" ripple @click="clicked(person)">
            <v-list-tile-avatar>
              <v-icon>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ person.fullName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { pick } from 'lodash'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapGetters('practitioners', ['list', 'practitionersByLetter']),
  },
  methods: {
    async clicked(person) {
      if (this.$route.query.add_teacher) {
        await this.$store.dispatch('auth/ensureAuth')
        await this.$store.dispatch('practitioners/patch', {
          id: person._id,
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
.card {
  margin: 1em;
  min-width: 400px;
}
</style>