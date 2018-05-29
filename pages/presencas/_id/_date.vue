<template>
  <v-layout align-content-center align-center column  v-if="chooseList">
    <practitioners-list title="Adicionar praticante à aula" :query="chooseQuery" @selected="selected" :chooseList="true" :twoLine="true" />
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout align-content-center align-center column v-else>
    <page-title icon="person"
      :title="classroom.title"
      :subtitle="isSubstitution && `Professor: ${teacher.displayName} (substituindo: ${classroom.teacher.displayName})`"
      :picture="teacher && teacher.picture"
    />
    <v-btn @click.stop="toggleChooseList('teacher')" color="primary" depressed>Trocar professor</v-btn>
    <v-dialog
      ref="dialog"
      v-model="datePicker"
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="date"
        label="Alterar data"
        prepend-icon="event"
        readonly
      ></v-text-field>
      <v-date-picker v-model="classDate" locale="pt-br" scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="datePicker = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="changeDate">OK</v-btn>
      </v-date-picker>
    </v-dialog>
    <v-card class="main-card">
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(freq, i) in practitionersFreq" :key="i">
          <v-divider></v-divider>
          <person-list-item :to="`/praticantes/${freq.practitionerId}`" :avatar="true" :person="freq.practitioner" property="displayName">
            <v-icon v-if="!isSubscribed(freq)" slot="right" color="orange darken-4">compare_arrows</v-icon>
            <v-btn slot="right" @click.stop="remove(freq)" flat icon><v-icon color="red darken-4">delete</v-icon></v-btn>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
    <page-cta icon="person_add" @click.stop="toggleChooseList('practitioner')" />
  </v-layout>
</template>

<script>
import api from '@/api'
import { paramsForServer } from 'feathers-hooks-common'
import { mapState } from 'vuex'
import { filter, find, get, includes, map } from 'lodash'
import { parseDate, unparseDate } from '@/utils/date-helpers'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

const fetch = (store, params) => {
  const { id, date } = params
  return store.dispatch('frequency/find', paramsForServer({
    query: {
      classId: id,
      createdAt: {
        $gte: `${date} 00:00:00`,
        $lt: `${date} 23:59:59.999`,
      },
    },
    populatePractitioners: true,
    populateClassroom: true,
  }))
}

export default {
  middleware: 'check-auth',
  components: { pageCta, pageTitle, personListItem, practitionersList },
  watchQuery: ['add'],
  data: () => ({
    datePicker: false,
    classDate: undefined,
  }),
  asyncData: ({ route }) => ({
    classDate: route.params.date,
  }),
  computed: {
    ...mapState('frequency', ['result']),
    chooseList() {
      return this.$route.query.add
    },
    classroom() {
      return get(this, 'result[0].classroom') || {}
    },
    date() {
      return parseDate(this.classDate, 'DD/MM/YYYY')
    },
    practitionersFreq() {
      return filter(this.result, f => f.practitionerId !== this.teacher._id)
    },
    taughtBy() {
      const temporary = find(this.result, f => f.teacher)
      return get(temporary, 'practitioner')
    },
    teacher() {
      return this.taughtBy || { _id: this.classroom.teacher }
    },
    isSubstitution() {
      const { teacher } = this.classroom
      return teacher && (this.teacher._id !== teacher._id)
    },
    chooseQuery() {
      const peopleIds = map(this.result, 'practitioner._id')
      return this.chooseList === 'teacher' ? { _id: peopleIds } : { _id: { $nin: peopleIds } }
    },
  },
  methods: {
    isSubscribed(freq) {
      return includes(freq.classroom.practitioners, freq.practitionerId)
    },
    toggleChooseList(add = 'practitioner') {
      const query = this.chooseList ? null : { add }
      this.$router.push({ query })
    },
    async changeDate() {
      this.datePicker = false
      const createdAt = unparseDate(this.classDate)
      await Promise.all(this.result.map(async f =>
        api.service('frequency').patch(f._id, { createdAt })
      ))
      this.$router.push(`/presencas/${this.$route.params.id}/${this.classDate}`)
    },
    async remove({ _id }) {
      await api.service('frequency').remove(_id)
      await fetch(this.$store, this.$route.params)
    },
    async selected({ _id }) {
      if (this.chooseList === 'teacher') {
        await Promise.all(this.result.map(async f =>
          api.service('frequency').patch(f._id, { teacher: f.practitionerId === _id })
        ))
        this.toggleChooseList()
      } else {
        const sample = this.result[0]
        await api.service('frequency').create({
          classId: sample.classId,
          createdAt: sample.createdAt,
          practitionerId: _id,
          teacher: false,
        })
        await fetch(this.$store, this.$route.params)
      }
    },
    async refetch() {
      await fetch(this.$store, this.$route.params)
    },
  },
  async fetch({ store, params }) {
    await fetch(store, params)
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .main-card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
}
</style>
