<template>
  <v-layout justify-center wrap>
    <practitioner-form title="Novo Praticante" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import practitionerForm from '@/components/practitioner-form'

export default {
  components: { practitionerForm },
  methods: {
    async submit(person) {
      const result = await new this.$FeathersVuex.Practitioner(person).save()
      if (result) this.$router.push('/praticantes')
    },
  },
  async fetch({ store }) {
    await fetchService('enrollment')(store)
  },
};
</script>
