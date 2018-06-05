<template>
  <v-layout justify-center wrap>
    <practitioner-form :title="`Editando ${person.fullName}`" :person="person" @submit="submit"></practitioner-form>
  </v-layout>
</template>

<script>
import { service } from '@/api'
import { isAnotherTeacher } from '@/utils/helpers'
import practitionerForm from '@/components/practitioner-form'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { practitionerForm },
  computed: {
    ...mapGetters({ isAdmin: 'auth/isAdmin', practitioner: 'auth/currentPractitioner' }),
    ...mapState('practitioners-service', ['person']),
  },
  methods: {
    async submit({ _id, ...data }) {
      const result = await service(this.$store, 'practitioners/patch', _id, data)
      if (result) this.$router.push('/praticantes')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('enrollment/find')
    await store.dispatch('practitioners-service/get', { id: params.id })
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
