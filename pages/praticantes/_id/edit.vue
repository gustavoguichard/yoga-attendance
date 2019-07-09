<template>
  <v-layout align-content-center align-center column>
    <page-title icon="person" title="Editando" :subtitle="person.fullName" :avatar="person.avatar" />
    <practitioner-form :person="person" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import fetchService from '@/api/fetch'
import { isAnotherTeacher } from '@/utils/helpers'
import pageTitle from '@/components/page-title'
import practitionerForm from '@/components/practitioner-form'
import { uploadPicture } from '@/utils/practitioners-helpers'

export default {
  components: { pageTitle, practitionerForm },
  computed: {
    ...mapGetters({ isAdmin: 'auth/isAdmin', practitioner: 'auth/currentPractitioner', get: 'practitioners/get' }),
    ...mapState('ui', ['online']),
    person() {
      return this.get(this.$route.params.id)
    },
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
      if (result) this.$router.push(this.$route.query.back_to || '/praticantes')
    },
  },
  async fetch({ store, params }) {
    await fetchService('practitioners')(store, {}, params.id)
    await fetchService('classrooms')(store)
    await fetchService('enrollment')(store)
  },
  mounted() {
    const allowed = this.isAdmin || !isAnotherTeacher(this.person, this.practitioner)
    if (!allowed) {
      this.$router.go(-1)
      this.$store.dispatch('notification/403')
    }
  },
};
</script>
