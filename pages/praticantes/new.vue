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
    ...mapState('ui', ['online']),
  },
  methods: {
    async submit(person) {
      let result
      if (this.online) {
        result = await new this.$FeathersVuex.Practitioner(person).save()
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
    await fetchService('enrollment')(store)
  },
};
</script>
