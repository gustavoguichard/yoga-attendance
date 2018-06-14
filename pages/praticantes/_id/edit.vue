<template>
  <v-layout justify-center wrap>
    <practitioner-form :title="`Editando ${person.fullName}`" :person="person" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import fetchService from '@/api/fetch'
import { isAnotherTeacher } from '@/utils/helpers'
import practitionerForm from '@/components/practitioner-form'
import { mapGetters } from 'vuex'

export default {
  components: { practitionerForm },
  computed: {
    ...mapGetters({ isAdmin: 'auth/isAdmin', practitioner: 'auth/currentPractitioner', get: 'practitioners/get' }),
    person() {
      return this.get(this.$route.params.id)
    },
  },
  methods: {
    async submit(person) {
      const result = await new this.$FeathersVuex.Practitioner(person).save()
      if (result) this.$router.push('/praticantes')
    },
  },
  async fetch({ store, params }) {
    await fetchService('practitioners')(store, {}, params.id)
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
