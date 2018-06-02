<template>
  <v-list dense>
    <template v-for="(item, i) in items">
      <v-list-tile v-if="!item.admin || isAdmin" :to="item.to">
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
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    items: [
      { name: 'Aulas e eventos', to: '/', icon: 'event_note' },
      { name: 'Praticantes', to: '/praticantes', icon: 'group' },
      { name: 'Professores', to: '/professores', icon: 'record_voice_over', admin: true },
      { name: 'Presenças', to: '/presencas', icon: 'playlist_add_check' },
      { name: 'Acertos', to: '/acertos', icon: 'account_balance_wallet', admin: true },
      { name: 'Regras de pagamento', to: '/matriculas', icon: 'settings', admin: true },
    ],
  }),
  computed: mapGetters('auth', ['isAdmin']),
};
</script>
