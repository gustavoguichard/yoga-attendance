<template>
  <v-card class="main-card">
    <v-toolbar @click.stop="openSearch">
      <v-text-field ref="search" @keyup.esc="closeSearch" @keydown.native.enter="enterSelected" @keyup.down="moveDown" @keyup.up="moveUp" v-model="filter" v-if="search" class="mx-4" label="Buscar" hide-details single-line></v-text-field>
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
        <person-list-item :active="(i === selectedPosition) && search" :avatar="true" :showMail="twoLine" avatarSize="28" :person="person" @click="clicked(person)">
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
import { mapGetters } from 'vuex'
import { isString } from 'lodash'
import { isAnotherTeacher, searchInFields } from '@/utils/helpers'
import fetchService from '@/api/fetch'
import personListItem from '@/components/person-list-item'

export default {
  props: {
    chooseList: { type: Boolean },
    dense: { type: Boolean },
    editLink: { type: Boolean },
    hideSelected: { type: Boolean },
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
    selectedIndex: 0,
    clickedPeople: [],
  }),
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      practitioner: 'auth/currentPractitioner',
      findPractitioners: 'practitioners/sortedFind',
    }),
    people() {
      const list = this.practitioners
        || this.findPractitioners({ query: this.query })
      const optFields = this.twoLine ? ['email'] : []
      const filtered = searchInFields(list, ['displayName', 'fullName', ...optFields], this.filter)
      return filtered.filter(person => !this.clickedPeople.includes(person._id))
    },
    selectedPosition() {
      return Math.min(this.people.length - 1, this.selectedIndex)
    },
  },
  methods: {
    clicked(person) {
      if (this.to) {
        const path = isString(this.to)
          ? this.to.replace(/:id/g, person._id)
          : this.to
        this.$router.push(path)
      } else if (this.hideSelected) {
        this.clickedPeople.push(person._id)
      }
      this.closeSearch()
      this.$emit('selected', person)
    },
    canEdit(person) {
      const allowed = this.isAdmin || !isAnotherTeacher(person, this.practitioner)
      return this.editLink && allowed
    },
    closeSearch() {
      this.search = false
      this.filter = ''
      this.selectedIndex = 0
    },
    moveDown() {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.people.length - 1)
    },
    moveUp() {
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
    },
    async openSearch() {
      this.search = true
      await this.$nextTick()
      this.$refs.search.focus()
    },
    async enterSelected() {
      this.clicked(this.people[this.selectedPosition])
    },
  },
  async mounted() {
    await (this.practitioners || fetchService('practitioners')(this.$store))
  },
}
</script>
