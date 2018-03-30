<template>
<v-layout justify-center class="page-container sign-in">
  <p v-if="error" class="error">{{ error }}</p>
  <v-card class="mt-3 py-4 px-2">
    <v-layout wrap>
      <v-flex column>
        <h3 class="text-xs-center">Olá professor :)</h3>
        <p class="text-xs-center">
          <img src="/logo.png" alt="Iyengar Brasil" class="mb-1" />
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
    <v-btn color="blue" dark fab absolute bottom right @click="submit">
      <v-icon>check</v-icon>
    </v-btn>
  </v-card>
</v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  middleware: 'not-authenticated',
  methods: {
    ...mapActions({
      authenticate: 'auth/authenticate',
    }),
    async submit() {
      const { email, password } = this;
      try {
        await this.authenticate({ email, password });
        this.$router.replace('/');
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },
  },
  watch: {
    error() {
      if (this.error) {
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    },
  },
};
</script>

<style scoped>
  .page-container {
    height: auto !important;
  }

@media (min-width: 800px) {
  .card {
    min-width: 400px;
    width: 60%;
  }
}
</style>