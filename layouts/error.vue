<template>
  <v-app id="ciyf-app" class="is-404">
    <application-controls />
    <v-container class="app-container" fluid fill-height>
      <v-layout justify-center class="page-container">
        <v-card class="main-card mt-3 py-4 px-2">
          <v-layout wrap>
            <v-card-text class="text-xs-center">
              <h1 class="display-4">{{ error.statusCode }}</h1>
              <img src="/logo.png" alt="Iyengar Brasil" width="150" class="my-4" />
              <p class="title">Página inválida.</p>
              <p class="body-2">Por favor, tente outra página ou volte mais tarde.</p>
            </v-card-text>
          </v-layout>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import applicationControls from '@/components/application-controls'

export default {
  name: 'nuxt-error',
  props: ['error'],
  components: { applicationControls },
};
</script>

<style>
#ciyf-app {
  width: 100%;
}
.app-container {
  padding: 0;
}
</style>
