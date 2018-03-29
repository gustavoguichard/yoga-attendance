<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Professores</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in list">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-tile avatar :key="i" :to="`/praticantes/${teacher._id}`">
            <v-list-tile-avatar>
              <img v-if="teacher.picture" :src="teacher.picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ teacher.fullName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </template>
      </v-list>
    </v-card>
    <v-btn color="blue" dark fab fixed bottom right to="/praticantes?teacher=false&add_teacher=true">
      <v-icon>person_add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'check-auth',
  computed: {
    ...mapState('practitioners', ['list']),
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('practitioners/find', {
      query: {
        teacher: true,
      },
    })
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