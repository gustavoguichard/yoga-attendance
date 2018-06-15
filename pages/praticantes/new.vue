<template>
  <v-layout justify-center wrap>
    <practitioner-form title="Novo Praticante" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import fetchService from '@/api/fetch'
import practitionerForm from '@/components/practitioner-form'

export default {
  components: { practitionerForm },
  computed: {
    ...mapState('ui', 'online'),
  },
  methods: {
    async submit(person) {
      if (this.online) {
        const result = await new this.$FeathersVuex.Practitioner(person).save()
        if (!result) return
      } else {
        this.$store.commit('offline/addPractitioner', person)
      }
      this.$router.push('/praticantes')
    },
  },
  async fetch({ store }) {
    await fetchService('enrollment')(store)
  },
};
</script>
