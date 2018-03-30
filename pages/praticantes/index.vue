<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Praticantes</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <template v-for="person in list">
          <v-list-tile ripple @click="clicked(person)">
            <v-list-tile-avatar>
              <v-avatar size="28">
                <img v-if="person.picture" :src="person.picture" alt="avatar">
                <v-icon v-else>person</v-icon>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="person.nickName">
                  {{ person.nickName }}
                  <em class="grey--text"> - {{ person.fullName }}</em>
                </span>
                <span v-else>{{ person.fullName }}</span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />
        </template>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right to="/praticantes/new">
      <v-icon>person_add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { pick } from 'lodash'

export default {
  middleware: 'check-auth',
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
.card {
  margin: 1em;
  min-width: 400px;
  width: 60%;
}
</style>