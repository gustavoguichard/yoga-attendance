<template>
  <v-layout align-content-center align-center column  v-if="chooseList">
    <practitioners-list :title="this.chooseList === 'teacher' ? 'Selecionar professor(a)' : 'Adicionar praticante à aula'" :query="chooseQuery" @selected="selected" :chooseList="true" :twoLine="true" :hideSelected="true" />
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout align-content-center align-center column v-else>
    <page-title icon="person"
      :title="lesson.title"
      :subtitle="isSubstitution && `Professor(a): ${lessonTeacher.displayName}`"
      :avatar="teacher && teacher.avatar"
    />
    <v-btn @click.stop="toggleChooseList('teacher')" color="primary" depressed>Trocar professor</v-btn>
    <date-picker :date="$route.params.date" @change="dateChanged" />
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Alunos presentes: {{ practitionersFreq.length }}</v-toolbar-title>
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
import { mapGetters } from 'vuex'
import { get, map, sortBy } from 'lodash'
import fetchService from '@/api/fetch'
import datePicker from '@/components/date-picker'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

const getTimeRange = date => ({
  $gte: `${date} 00:00:00`,
  $lt: `${date} 23:59:59.999`,
})

export default {
  components: { datePicker, pageCta, pageTitle, personListItem, practitionersList },
  data: () => ({
    added: [],
  }),
  computed: {
    ...mapGetters({
      getClassroom: 'classrooms/get',
      getPerson: 'practitioners/get',
      findFrequency: 'frequency/findByTimeRange',
    }),
    chooseList() {
      return this.$route.query.add
    },
    frequency() {
      const { id, date } = this.$route.params
      return this.findFrequency(getTimeRange(date), { classId: id })
    },
    lesson() {
      return this.getClassroom(this.$route.params.id)
    },
    lessonTeacher() {
      return this.getPerson(this.lesson.teacher)
    },
    practitionersFreq() {
      const result = this.frequency.filter(f => f.practitionerId !== this.taughtById)
      const sorted = sortBy(result, 'practitioner.displayName')
      return sorted.map(f => {
        const practitioner = this.getPerson(f.practitionerId)
        return { ...f, practitioner }
      })
    },
    taughtBy() {
      const temporary = this.frequency.find(f => f.teacher) || {}
      return this.getPerson(temporary.practitionerId)
    },
    taughtById() {
      return get(this.taughtBy, '_id')
    },
    teacher() {
      return this.taughtBy || this.lessonTeacher
    },
    isSubstitution() {
      const { teacher } = this.lesson
      return teacher && (this.teacher._id !== teacher)
    },
    chooseQuery() {
      const peopleIds = map(this.frequency, 'practitionerId')
      const teachers = { teacher: true, _id: { $ne: this.taughtById, $in: peopleIds } }
      const practitioners = { _id: { $nin: peopleIds } }
      return this.chooseList === 'teacher' ? teachers : practitioners
    },
  },
  methods: {
    isSubscribed({ practitionerId }) {
      return this.lesson.practitioners.includes(practitionerId)
    },
    toggleChooseList(add = 'practitioner') {
      const query = this.chooseList ? null : { add }
      this.$router.push({ query })
    },
    async dateChanged(createdAt, parsedDate) {
      const { id } = this.$route.params
      this.datePicker = false
      await Promise.all(this.frequency.map(async f =>
        new this.$FeathersVuex.Frequency({ ...f, createdAt })
          .patch()
      ))
      this.$router.push(`/presencas/${id}/${parsedDate}`)
    },
    async createFrequencies() {
      await Promise.all(this.added.map(async f => f.save()))
      this.added = []
    },
    async remove(person) {
      const freq = new this.$FeathersVuex.Frequency(person)
      await freq.remove()
    },
    async selected({ _id }) {
      if (this.chooseList === 'teacher') {
        await Promise.all(this.frequency.map(async f => {
          const teacher = f.practitionerId === _id
          return new this.$FeathersVuex.Frequency({ ...f, teacher })
            .patch()
        }))
        this.toggleChooseList()
      } else {
        const sample = this.frequency[0]
        const { Frequency } = this.$FeathersVuex
        this.added.push(new Frequency({
          classId: sample.classId,
          createdAt: sample.createdAt,
          practitionerId: _id,
          teacher: false,
        }))
      }
    },
  },
  async fetch({ store, params }) {
    const { date } = params
    await fetchService('practitioners')(store)
    await fetchService('classrooms')(store)
    await fetchService('frequency')(store, {
      createdAt: getTimeRange(date),
    }, date)
  },
  mounted() {
    this.$router.afterEach((to, from) => {
      if (from.query.add === 'practitioner') {
        this.createFrequencies()
      }
    })
  },
};
</script>
