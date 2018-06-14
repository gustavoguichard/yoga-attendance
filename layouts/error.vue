<template>
  <v-app id="ciyf-app" class="is-404">
    <v-container class="app-container" fluid fill-height>
      <v-layout justify-center class="page-container">
        <v-card class="main-card mt-3 py-4 px-2">
          <v-layout wrap>
            <v-card-text class="text-xs-center">
              <h1 class="display-4">{{ error.statusCode }}</h1>
              <img src="/logo.png" alt="Iyengar Brasil" width="150" class="my-4" />
              <p class="title">{{ message.title }}.</p>
              <p class="body-2">{{ message.desc }}.</p>
            </v-card-text>
          </v-layout>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { inRange } from 'lodash'

export default {
  name: 'nuxt-error',
  props: ['error'],
  computed: {
    message() {
      return inRange(this.error.statusCode, 400, 500)
        ? { title: 'Página inválida', desc: 'Esta página não existe no momento, tente navegar pelas outras páginas do sistema' }
        : { title: 'Erro interno', desc: 'Ocorreu algum problema no sistema. Por favor, tente atualizar a página e se o problema persistir, contate o responsável' }
    },
  },
  mounted() {
    this.$store.dispatch('ui/done')
  },
}
</script>

<style>
#ciyf-app {
  width: 100%;
}
.app-container {
  padding: 0;
}
</style>
