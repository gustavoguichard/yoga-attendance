<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person_add" title="Novo praticante" />
    <practitioner-form @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import fetchService from '@/api/fetch'
import pageTitle from '@/components/page-title'
import practitionerForm from '@/components/practitioner-form'
import { uploadPicture } from '@/utils/practitioners-helpers'

export default {
  components: { pageTitle, practitionerForm },
  computed: {
    ...mapState('ui', ['online']),
  },
  methods: {
    async submit(person, file) {
      let result
      if (this.online) {
        const data = file ? (await uploadPicture(person, file)) : person
        result = await new this.$FeathersVuex.Practitioner(data).save()
      } else {
        this.$store.commit('offline/addPractitioner', person)
        result = true
      }
      if (result) {
        if (this.$route.query.back_to) {
          this.$store.dispatch('attendance/newPractitioner', result)
        }
        this.$router.push(this.$route.query.back_to || '/praticantes')
      }
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('enrollment')(store)
  },
};
</script>
