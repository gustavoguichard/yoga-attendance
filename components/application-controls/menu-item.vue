<template>
  <v-list-group
    v-if="item.group"
    v-show="visibleItem(item)"
    :prepend-icon="item.icon"
  >
    <v-list-tile slot="activator">
      <v-list-tile-content>
        <v-list-tile-title>{{ item.group }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <menu-item v-for="(child, i) in item.items" :key="i" :item="child" />
  </v-list-group>
  <v-list-tile v-else :to="item.to" v-show="visibleItem(item)">
    <v-list-tile-action v-if="item.icon">
      <v-icon v-html="item.icon"></v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title v-html="item.name"></v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'menu-item',
  props: ['item'],
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    ...mapState('ui', ['online']),
  },
  methods: {
    visibleItem(entry) {
      return (!entry.admin || this.isAdmin) && (this.online || entry.offline)
    },
  },
};
</script>
