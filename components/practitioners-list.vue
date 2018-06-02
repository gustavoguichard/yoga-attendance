<template>
  <v-card class="main-card">
    <v-toolbar @click.stop="openSearch">
      <v-text-field ref="search" v-model="filter" @blur="search = false" v-if="search" class="mx-4" label="Buscar" hide-details single-line></v-text-field>
      <template v-else>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </template>
      <v-btn icon dark>
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-title v-if="$slots['header']">
      <slot name="header"></slot>
    </v-card-title>
    <v-list :dense="dense" :two-line="twoLine">
      <template v-for="(person, i) in people">
        <v-divider v-if="i > 0" />
        <person-list-item :avatar="true" :showMail="twoLine" avatarSize="28" :person="person" @click="clicked(person)">
          <v-btn icon v-if="canEdit(person)" ripple slot="right" @click.stop="$router.push(`/praticantes/${person._id}/edit`)">
            <v-icon color="grey">edit</v-icon>
          </v-btn>
        </person-list-item>
      </template>
    </v-list>
    <v-card-actions v-if="$slots['footer'] || chooseList">
      <slot name="footer"></slot>
      <v-spacer></v-spacer>
      <v-btn v-if="chooseList" @click="$router.push({ query: null })" flat dark color="cyan darken-3">
        Voltar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { isString } from 'lodash'
import { isAnotherTeacher, searchInFields } from '@/utils/helpers'
import personListItem from '@/components/person-list-item'

const fetch = async (store, query) => {
  await store.dispatch('practitioners/find', { query })
}

export default {
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
  components: { personListItem },
  data: () => ({
    search: false,
    filter: '',
  }),
  computed: {
    ...mapGetters({ isAdmin: 'auth/isAdmin', practitioner: 'auth/currentPractitioner' }),
    ...mapState('practitioners', ['list']),
    people() {
      const list = this.practitioners || this.list
      const optFields = this.twoLine ? ['email'] : []
      const filtered = searchInFields(list, ['displayName', 'fullName', ...optFields], this.filter)
      return filtered
    },
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
    canEdit(person) {
      const allowed = this.isAdmin || !isAnotherTeacher(person, this.practitioner)
      return this.editLink && allowed
    },
    async openSearch() {
      this.search = true
      await this.$nextTick()
      this.$refs.search.focus()
    },
  },
  watch: {
    async query(newQuery) {
      await fetch(this.$store, newQuery)
    },
  },
  async mounted() {
    if (!this.practitioners) {
      await fetch(this.$store, this.query)
    }
  },
}
</script>
