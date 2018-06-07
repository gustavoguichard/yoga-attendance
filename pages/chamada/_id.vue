<template>
  <v-layout v-if="chooseList" justify-center wrap>
    <practitioners-list :practitioners="otherPractitioners" title="Escolha o praticante" @selected="addToLesson" :chooseList="true">
      <v-switch color="cyan darken-3" slot="footer" :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
    </practitioners-list>
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout v-else justify-center justify-space-around wrap>
    <v-card class="half">
      <v-toolbar>
        <v-btn icon dark @click="selectAll">
          <v-icon v-if="allSelected" color="blue darken-4">check_circle</v-icon>
          <v-icon v-else>check</v-icon>
        </v-btn>
        <v-toolbar-title>Praticantes da turma</v-toolbar-title>
      </v-toolbar>
      <v-list dense subheader>
        <div v-for="person in listedPeople" :key="person._id">
          <person-list-item avatar="right" :person="person" @click="toggle(person)">
            <v-icon slot="left" @click="togglePerson(person, $event)" :color="icon(person).color">{{ icon(person).name }}</v-icon>
          </person-list-item>
        </div>
      </v-list>
      <v-card-actions>
        <v-btn @click.stop="toggleChooseList" icon depressed dark color="cyan darken-3">
          <v-icon>person_add</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="half">
      <v-toolbar>
        <v-toolbar-title>Professor</v-toolbar-title>
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
    <page-cta @click="submit()" icon="done_all" />
  </v-layout>
</template>

<script>
import { service } from '@/api'
import moment from 'moment'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { filter, includes, map } from 'lodash'
import fetchService from '@/api/fetch'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  watchQuery: ['add'],
  components: { pageCta, personListItem, practitionersList },
  data: () => ({ restituting: true }),
  computed: {
    ...mapGetters({
      teachers: 'practitioners/teachers',
      findPractitioners: 'practitioners/sortedFind',
    }),
    ...mapGetters('attendance', ['everyAttendant']),
    ...mapGetters('classrooms', ['get']),
    ...mapState('auth', ['user']),
    ...mapState('attendance', ['selected', 'restitution', 'currentTeacher']),
    allSelected() {
      return this.subscribedList.length === this.selected.length
    },
    chooseList() {
      return !!this.$route.query.add
    },
    subscribedList() {
      const query = { _id: { $in: this.lesson.practitioners, $ne: this.teacher.id } }
      return this.findPractitioners({ query })
    },
    lesson() {
      return this.get(this.$route.params.id)
    },
    listedPeople() {
      return [...this.subscribedList, ...this.restitution]
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
        || this.lesson.teacherData
        || { _id: null }
    },
  },
  methods: {
    ...mapActions('attendance', ['addRestitution', 'toggleRestituting', 'toggle']),
    ...mapMutations('attendance', ['cleanStore', 'updateTeacher', 'updateSelected']),
    addToLesson(person) {
      this.addRestitution({ ...person, restituting: this.restituting })
    },
    togglePerson(person, event) {
      if (this.isRestituting(person)) {
        this.toggleRestituting(person)
        event.stopPropagation()
      }
    },
    toggleChooseList(add = 'practitioner') {
      const query = this.chooseList ? null : { add }
      this.$router.push({ query })
    },
    icon(person) {
      if (this.isRestituting(person)) {
        return person.restituting
          ? { color: 'orange darken-4', name: 'compare_arrows' }
          : { color: 'green darken-2', name: 'check_circle' }
      }
      return this.isSelected(person)
        ? { color: 'cyan darken-3', name: 'check_circle' }
        : { color: 'grey lighten-1', name: 'check' }
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
      return includes(this.selected, _id)
    },
    isRestituting({ _id }) {
      return includes(map(this.restitution, '_id'), _id)
    },
    async createFrequency(id, teacher = false) {
      return service(this.$store, 'frequency/create', {
        teacher,
        practitionerId: id,
        classId: this.lesson._id,
      })
    },
    async submit() {
      const newSubscribers = filter(this.restitution, p => !p.restituting)
      if (newSubscribers.length) {
        await service(this.$store, 'classrooms/patch', this.lesson._id, { practitioners: [...this.lesson.practitioners, ...newSubscribers] })
      }
      await Promise.all(this.everyAttendant.map(async person => this.createFrequency(person)))
      if (this.teacher._id) {
        await this.createFrequency(this.teacher._id, true)
      }
      await this.$store.commit('attendance/cleanStore')
      const date = moment().format('YYYY-MM-DD')
      this.$router.push(`/presencas/${this.lesson._id}/${date}`)
    },
  },
  async fetch({ store }) {
    await fetchService('classrooms')(store)
    await fetchService('practitioners')(store)
  },
};
</script>
