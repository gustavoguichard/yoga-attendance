<template>
  <v-layout align-content-center align-center column>
    <page-title
      :title="chooseList ? 'Escolha o praticante' : 'Professores'"
      icon="record_voice_over"
    />
    <practitioners-list v-if="chooseList" @selected="selected" :practitioners="nonTeachers" :chooseList="true" :twoLine="true" />
    <practitioners-list v-else to="/praticantes/:id" :twoLine="true" :practitioners="teachers" />
    <page-cta :icon="chooseList ? 'arrow_back' : 'person_add'" @click.stop="toggleChooseList" />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import practitionersList from '@/components/practitioners-list'
import fetchService from '@/api/fetch'

export default {
  middleware: ['check-admin'],
  components: { pageCta, pageTitle, practitionersList },
  computed: {
    ...mapGetters('practitioners', ['teachers', 'nonTeachers']),
    chooseList() {
      return !!this.$route.query.add
    },
  },
  methods: {
    async toggleChooseList() {
      const query = this.chooseList ? null : { add: 'teacher' }
      this.$router.push({ query })
    },
    async selected({ _id }) {
      await new this.$FeathersVuex.Practitioner({ _id, teacher: true }).patch()
      this.toggleChooseList()
    },
  },
  async fetch({ store }) {
    await fetchService('practitioners')(store)
  },
};
</script>
