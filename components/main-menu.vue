<template>
  <v-list dense>
    <template v-for="(item, i) in items">
      <v-list-tile :to="item.to">
        <v-list-tile-action v-if="item.icon">
          <v-icon v-html="item.icon">spa</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-html="item.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
export default {
  data: () => ({
    items: [
      { name: 'Aulas', to: '/', icon: 'spa' },
      { name: 'Praticantes', to: '/praticantes', icon: 'group' },
      { name: 'Professores', to: '/professores', icon: 'record_voice_over' },
      { name: 'Acertos', to: '/acertos', icon: 'monetization_on' },
    ],
  }),
};
</script>
