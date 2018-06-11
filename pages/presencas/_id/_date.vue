<template>
  <v-layout align-content-center align-center column  v-if="chooseList">
    <practitioners-list title="Adicionar praticante à aula" :query="chooseQuery" @selected="selected" :chooseList="true" :twoLine="true" />
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout align-content-center align-center column v-else>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="isSubstitution && `Professor(a): ${teacher.displayName}`"
      :avatar="teacher && teacher.avatar"
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
      <v-toolbar>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(freq, i) in practitionersFreq" :key="i">
          <v-divider></v-divider>
          <person-list-item :to="`/praticantes/${freq.practitionerId}`" :avatar="true" :person="freq.practitioner">
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
import { service } from '@/api'
import { mapGetters } from 'vuex'
import { filter, find, get, map } from 'lodash'
import fetchService from '@/api/fetch'
import { parseDate, unparseDate } from '@/utils/date-helpers'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

const getTimeRange = date => ({
  $gte: `${date} 00:00:00`,
  $lt: `${date} 23:59:59.999`,
})

const fetch = async (store, params) => {
  const { date } = params
  await fetchService('classrooms')(store)
  await fetchService('frequency')(store, {
    createdAt: getTimeRange(date),
  }, date)
}

export default {
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
    ...mapGetters({
      getClassroom: 'classrooms/get',
      findFrequency: 'frequency/findByTimeRange',
    }),
    chooseList() {
      return this.$route.query.add
    },
    date() {
      return parseDate(this.classDate, 'DD/MM/YYYY')
    },
    frequency() {
      const { id, date } = this.$route.params
      return this.findFrequency(getTimeRange(date), { classId: id })
    },
    lesson() {
      return this.getClassroom(this.$route.params.id)
    },
    practitionersFreq() {
      return filter(this.frequency, f => f.practitionerId !== this.teacher._id)
    },
    taughtBy() {
      const temporary = find(this.frequency, f => f.teacher)
      return get(temporary, 'practitioner')
    },
    teacher() {
      return this.taughtBy || this.lesson.teacherData
    },
    isSubstitution() {
      const { teacher } = this.lesson
      return teacher && (this.teacher._id !== teacher)
    },
    chooseQuery() {
      const peopleIds = map(this.frequency, 'practitioner._id')
      const teachers = { teacher: true, _id: { $ne: this.teacher._id, $in: peopleIds } }
      const practitioners = { _id: { $nin: peopleIds } }
      return this.chooseList === 'teacher' ? teachers : practitioners
    },
  },
  methods: {
    isSubscribed(freq) {
      return freq.classroom.practitioners.includes(freq.practitionerId)
    },
    toggleChooseList(add = 'practitioner') {
      const query = this.chooseList ? null : { add }
      this.$router.push({ query })
    },
    async changeDate() {
      this.datePicker = false
      const createdAt = unparseDate(this.classDate)
      await Promise.all(this.frequency.map(async f =>
        service(this.$store, 'frequency/patch', f._id, { createdAt })
      ))
      this.$router.push(`/presencas/${this.$route.params.id}/${this.classDate}`)
    },
    async remove({ _id }) {
      await service(this.$store, 'frequency/remove', _id)
      await fetch(this.$store, this.$route.params)
    },
    async selected({ _id }) {
      if (this.chooseList === 'teacher') {
        await Promise.all(this.frequency.map(async f =>
          service(this.$store, 'frequency/patch', f._id, { teacher: f.practitionerId === _id })
        ))
        this.toggleChooseList()
      } else {
        const sample = this.frequency[0]
        await service(this.$store, 'frequency/create', {
          classId: sample.classId,
          createdAt: sample.createdAt,
          practitionerId: _id,
          teacher: false,
        })
        await fetch(this.$store, this.$route.params)
      }
    },
  },
  async fetch({ store, params }) {
    await fetch(store, params)
  },
};
</script>
