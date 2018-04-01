<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Professores</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(teacher, i) in list">
          <v-divider v-if="i !== 0"></v-divider>
          <person-list-item :avatar="true" :person="teacher" property="displayName" :to="`/praticantes/${teacher._id}`" />
          <v-divider></v-divider>
        </template>
      </v-list>
    </v-card>
    <page-cta icon="person_add" to="/praticantes?teacher=false&add_teacher=true" />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'

export default {
  middleware: 'check-auth',
  components: { pageCta, personListItem },
  computed: {
    ...mapState('practitioners', ['list']),
  },
  async fetch({ store }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('practitioners/find', {
      query: { teacher: true },
    })
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