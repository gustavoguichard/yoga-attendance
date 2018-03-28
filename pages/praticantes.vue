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
          <v-list-tile v-for="person in people" :key="person.fullName" ripple @click.native="">
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

export default {
  middleware: 'check-auth',
  computed: {
    ...mapGetters('practitioners', ['list', 'practitionersByLetter']),
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('practitioners/fetch')
  },
};
</script>

<style scoped>
.card {
  margin: 1em;
  min-width: 400px;
}
</style>