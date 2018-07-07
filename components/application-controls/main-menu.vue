<template>
  <v-list dense>
    <menu-item v-for="(item, i) in items" :key="i" :item="item" />
  </v-list>
</template>

<script>
import menuItem from './menu-item'

export default {
  name: 'main-menu',
  components: { menuItem },
  data: () => ({
    items: [
      { name: 'Aulas e eventos', to: '/', icon: 'event_note', offline: true },
      { name: 'Praticantes', to: '/praticantes', icon: 'group', offline: true },
      { name: 'Professores', to: '/professores', icon: 'record_voice_over', admin: true },
      { name: 'Presenças', to: '/presencas', icon: 'playlist_add_check' },
      {
        group: 'Fechamento',
        icon: 'attach_money',
        admin: true,
        items: [
          { name: 'Por praticante', to: '/fechamento/praticantes', icon: 'face' },
          { name: 'Por turma', to: '/fechamento/turmas', icon: 'event' },
        ],
      },
      { name: 'Regras de pagamento', to: '/matriculas', icon: 'settings', admin: true },
    ],
  }),
}
</script>
