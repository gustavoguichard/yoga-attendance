<template>
  <v-layout v-if="chooseList" align-content-center align-center column>
    <practitioners-list :practitioners="otherPractitioners" title="Escolha o praticante" @selected="addToLesson" :chooseList="true">
      <v-btn slot="header" color="primary" :to="`/praticantes/new?back_to=${$route.path}`">
        Adicionar novo
      </v-btn>
      <v-switch color="cyan darken-3" slot="footer" :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
    </practitioners-list>
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout v-else align-content-center align-center column>
    <page-title
      title="Selecione os praticantes"
      :subtitle="`${lesson.title} - ${teacher.fullName}`"
    />
    <date-picker label="Data da chamada" @change="dateChanged" />
    <v-card class="main-card">
      <v-toolbar>
        <v-btn icon dark @click="selectAll">
          <v-icon v-if="allSelected" color="blue darken-4">check_circle</v-icon>
          <v-icon v-else>check</v-icon>
        </v-btn>
        <v-toolbar-title v-if="counter">Presentes - {{ counter }}</v-toolbar-title>
        <v-toolbar-title v-else>Praticantes da turma:</v-toolbar-title>
      </v-toolbar>
      <v-list dense subheader>
        <div v-for="person in listedPeople" :key="person._id">
          <person-list-item avatar="right" :person="person" @click="toggle(person)">
            <span slot="left" v-if="isRestituting(person)" @click.stop="toggleRestituting(person)">
              <v-icon v-if="person.restituting" color="orange darken-2">compare_arrows</v-icon>
              <v-icon v-else color="green darken-2">check_circle</v-icon>
            </span>
            <span slot="left" v-else>
              <v-icon v-if="isSelected(person)" color="cyan darken-2">check_circle</v-icon>
              <v-icon v-else color="grey lighten-2">check</v-icon>
            </span>
          </person-list-item>
        </div>
      </v-list>
      <v-card-actions>
        <v-btn @click.stop="toggleChooseList" icon depressed dark color="cyan darken-3">
          <v-icon>person_add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-toolbar>
        <v-toolbar-title>Selecionar professor:</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <div v-for="(teacher, i) in teachers" :key="teacher._id">
          <v-divider v-if="i > 0"></v-divider>
          <person-list-item :person="teacher" @click="updateTeacher(teacher)" avatar="right">
            <v-icon slot="left" v-if="isTeacher(teacher)" color="yellow darken-2">star</v-icon>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
    <page-cta @click="submit" icon="done_all" />
  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { map } from 'lodash'
import fetchService from '@/api/fetch'
import datePicker from '@/components/date-picker'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  components: { datePicker, pageCta, pageTitle, personListItem, practitionersList },
  data: () => ({
    restituting: true,
    createdAt: new Date(),
  }),
  computed: {
    ...mapGetters({
      getPerson: 'practitioners/get',
      teachers: 'practitioners/teachers',
      findPractitioners: 'practitioners/sortedFind',
      everyAttendant: 'attendance/everyAttendant',
      getClassroom: 'classrooms/get',
    }),
    ...mapState('auth', ['user']),
    ...mapState('ui', ['online']),
    ...mapState('attendance', ['selected', 'restitution', 'currentTeacher', 'newPractitioner']),
    allSelected() {
      return this.subscribedList.length === this.selected.length
    },
    counter() {
      return this.everyAttendant.length
    },
    chooseList() {
      return !!this.$route.query.add
    },
    subscribedList() {
      const query = { _id: { $in: this.lesson.practitioners, $ne: this.teacher._id } }
      return this.findPractitioners({ query })
    },
    lesson() {
      return this.getClassroom(this.$route.params.id)
    },
    listedPeople() {
      return [...this.subscribedList, ...this.restitution]
    },
    newSubscribers() {
      return map(this.restitution.filter(p => !p.restituting), '_id')
    },
    otherPractitioners() {
      const usedIds = [...this.subscribedList, ...this.restitution, this.teacher]
      const $nin = map(usedIds, '_id')
      const query = { _id: { $nin } }
      return this.findPractitioners({ query })
    },
    teacher() {
      return this.currentTeacher
        || (this.user.practitioner.teacher && this.user.practitioner)
        || this.getPerson(this.lesson.teacher)
        || { _id: null }
    },
  },
  methods: {
    ...mapActions('attendance', ['addRestitution', 'toggleRestituting', 'toggle']),
    ...mapMutations('attendance', ['cleanStore', 'updateTeacher', 'updateSelected']),
    ...mapMutations('offline', ['addFrequency']),
    addToLesson(person) {
      this.addRestitution({ ...person, restituting: this.restituting })
    },
    dateChanged(date) {
      this.createdAt = date
    },
    toggleChooseList() {
      const query = this.chooseList ? null : { add: 'practitioner' }
      this.$router.push({ query })
    },
    selectAll() {
      const list = this.allSelected ? [] : map(this.subscribedList, '_id')
      this.updateSelected(list)
    },
    isTeacher({ _id }) {
      return _id === this.teacher._id
    },
    isntTeaching({ _id }) {
      return this.teacher._id !== _id
    },
    isSelected({ _id }) {
      return this.selected.includes(_id)
    },
    isRestituting({ _id }) {
      return map(this.restitution, '_id').includes(_id)
    },
    async addSubscribers() {
      if (!this.online || !this.newSubscribers.length) return Promise.resolve()
      const practitioners = this.lesson.practitioners.concat(this.newSubscribers)
      return new this.$FeathersVuex.Classroom({ ...this.lesson, practitioners })
        .patch()
    },
    async createFrequency(practitionerId, teacher = false) {
      const classId = this.lesson._id
      const { createdAt } = this
      const freq = { teacher, practitionerId, classId, createdAt }
      return this.online
        ? new this.$FeathersVuex.Frequency(freq).save()
        : this.addFrequency(freq)
    },
    async submit() {
      if (!this.teacher._id) {
        return this.$store.dispatch('notification/info', 'É necessário selecionar um professor')
      }
      await this.addSubscribers()
      try {
        await Promise.all(this.everyAttendant.map(async person => this.createFrequency(person)))
        await this.createFrequency(this.teacher._id, true)
      } catch (error) {
        this.$store.dispatch('notification/info', 'Alguns praticantes já estão inscritos')
      }
      this.$store.commit('attendance/cleanStore')
      if (!this.online) return this.$router.push('/')
      const date = moment(this.createdAt).format('YYYY-MM-DD')
      return this.$router.push(`/presencas/${this.lesson._id}/${date}`)
    },
  },
  mounted() {
    if (this.newPractitioner) {
      this.addToLesson(this.newPractitioner)
      this.$store.dispatch('attendance/clearPractitioner')
    }
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
  },
};
</script>
