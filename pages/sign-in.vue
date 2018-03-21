<template>
<div class="page-container sign-in">
  <p v-if="error" class="error">{{ error }}</p>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mt-5 pt-4">
        <h3 class="text-xs-center">Olá professor :)</h3>
        <v-layout row justify-space-around>
          <img src="/logo.png" alt="Iyengar Brasil" class="mb-1" />
        </v-layout>
        <v-card-text>
          <blockquote>Yoga é como um espelho para olharmos para dentro de nós mesmos.</blockquote>
          <div class="text-xs-right">
            <em><small>&mdash; B.K.S Iyengar</small></em>
          </div>
        </v-card-text>
        <v-card-text>
          <v-text-field @keyup.enter.native="submit" v-model="email" autofocus name="email" label="E-mail" id="email"></v-text-field>
          <v-text-field @keyup.enter.native="submit" v-model="password" type="password" name="password" label="Senha" id="password"></v-text-field>
        </v-card-text>
        <v-card-row actions>
          <!-- <v-btn flat primary light>Esqueci-minha senha</v-btn> -->
          <v-btn primary light @click.native="submit">Entrar</v-btn>
        </v-card-row>
      </v-card>
    </v-flex>
  </v-layout>
</div>
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
        this.$router.replace('/protected');
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
