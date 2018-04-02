<template>
  <v-card>
    <v-toolbar color="blue-grey lighten-1" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-title v-if="$slots['header']">
      <slot name="header"></slot>
    </v-card-title>
    <v-list :dense="dense" :two-line="twoLine">
      <template v-for="(person, i) in people">
        <v-divider v-if="i > 0" />
        <person-list-item :avatar="true" avatarSize="28" :person="person" @click="clicked(person)">
          <v-btn icon v-if="editLink" ripple slot="right" @click.stop="$router.push(`/praticantes/${person._id}/edit`)">
            <v-icon color="grey">edit</v-icon>
          </v-btn>
        </person-list-item>
      </template>
    </v-list>
    <v-card-actions v-if="$slots['footer'] || chooseList">
      <slot name="footer"></slot>
      <v-spacer></v-spacer>
      <v-btn v-if="chooseList" @click="$router.push({ query: null })" flat color="primary">
        Voltar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import personListItem from '@/components/person-list-item'
import { mapState } from 'vuex'
import { isString } from 'lodash'

export default {
  components: { personListItem },
  computed: {
    ...mapState('practitioners', ['list']),
    people() {
      return this.practitioners || this.list
    },
  },
  props: {
    chooseList: { type: Boolean },
    dense: { type: Boolean },
    editLink: { type: Boolean },
    practitioners: { type: Array },
    query: { type: Object },
    title: { type: String, default: 'Praticantes' },
    to: { type: String },
    twoLine: { type: Boolean },
  },
  methods: {
    clicked(person) {
      if (this.to) {
        const path = isString(this.to)
          ? this.to.replace(/:id/g, person._id)
          : this.to
        this.$router.push(path)
      }
      this.$emit('selected', person)
    },
  },
  watch: {
    async query(newQuery) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/find', { query: newQuery })
    },
  },
  async mounted() {
    if (!this.practitioners) {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/find', { query: this.query })
    }
  },
}
</script>
