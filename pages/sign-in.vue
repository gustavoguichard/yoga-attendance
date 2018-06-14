<template>
<v-layout justify-center class="page-container">
  <v-card class="main-card mt-3 py-4 px-2">
    <v-layout wrap>
      <v-flex column>
        <p class="text-xs-center">
          <img src="/logo.png" alt="Iyengar Brasil" width="200" class="mb-1" />
        </p>
      </v-flex>
      <v-card-text>
        <blockquote>Yoga é como um espelho para olharmos para dentro de nós mesmos.</blockquote>
        <div class="text-xs-right">
          <em><small>&mdash; B.K.S Iyengar</small></em>
        </div>
        <v-text-field @keyup.enter.native="submit" v-model="email" autofocus name="email" label="E-mail" id="email"></v-text-field>
        <v-text-field @keyup.enter.native="submit" v-model="password" type="password" name="password" label="Senha" id="password"></v-text-field>
      </v-card-text>
    </v-layout>
    <page-cta :absolute="true" @click="submit" icon="check" />
  </v-card>
</v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import pageCta from '@/components/page-cta'

export default {
  components: { pageCta },
  data: () => ({
    email: '',
    password: '',
  }),
  middleware: 'not-authenticated',
  methods: {
    ...mapActions('auth', ['authenticate']),
    async submit() {
      const { email, password } = this;
      this.$store.dispatch('ui/load')
      try {
        await this.authenticate({ email, password });
        this.$store.dispatch('notification/success', 'Bem vindo(a)!')
        this.$router.replace('/');
      } catch (e) {
        if (e.message === 'Network Error') {
          this.$store.dispatch('notification/offline')
        } else {
          this.$store.dispatch('notification/error', e.message)
        }
      }
      this.$store.dispatch('ui/done')
    },
  },
};
</script>
