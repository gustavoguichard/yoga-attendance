<template>
  <v-layout v-if="chooseList" justify-center wrap>
    <practitioners-list :practitioners="otherPractitioners" title="Escolha o praticante" @selected="addToLesson" :chooseList="true">
      <v-switch slot="footer" :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
    </practitioners-list>
  </v-layout>
  <v-layout v-else justify-center wrap>
    <v-card class="half">
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-btn icon @click="selectAll">
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
        <v-btn @click.stop="$router.push('?add=practitioner')" icon depressed color="primary">
          <v-icon>person_add</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="half">
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Professor</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <div v-for="(teacher, i) in teachers" :key="teacher._id">
          <v-divider v-if="i > 0"></v-divider>
          <person-list-item :person="teacher" property="displayName" @click="updateTeacher(teacher)" avatar="right">
            <v-list-tile-action slot="left">
              <v-icon v-if="isTeacher(teacher)" color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
    <page-cta @click="submit()" icon="done_all" />
  </v-layout>
</template>

<script>
import api from '@/api'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { difference, filter, includes, map } from 'lodash'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  middleware: 'check-auth',
  watchQuery: ['add'],
  components: { pageCta, personListItem, practitionersList },
  data: () => ({ restituting: true }),
  computed: {
    ...mapGetters('practitioners', ['teachers']),
    ...mapGetters('attendance', ['everyAttendant']),
    ...mapState('attendance', ['selected', 'restitution', 'currentTeacher']),
    ...mapState('practitioners', ['list']),
    ...mapState('classrooms', ['lesson']),
    allSelected() {
      return this.subscribedList.length === this.selected.length
    },
    chooseList() {
      return !!this.$route.query.add
    },
    subscribedList() {
      const isSubscribed = person => includes(this.lesson.practitioners, person._id)
      return filter(this.list, person =>
        isSubscribed(person) && this.isntTeaching(person)
      )
    },
    listedPeople() {
      return [...this.subscribedList, ...this.restitution]
    },
    otherPractitioners() {
      const notSubscribed = difference(this.list, this.subscribedList)
      return filter(notSubscribed, p =>
        !includes(map(this.restitution, '_id'), p._id) && this.isntTeaching(p)
      )
    },
    teacher() {
      return this.currentTeacher || this.lesson.teacher || { _id: null }
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
    icon(person) {
      if (this.isRestituting(person)) {
        return person.restituting
          ? { color: 'orange darken-4', name: 'compare_arrows' }
          : { color: 'green darken-2', name: 'check_circle' }
      }
      return this.isSelected(person)
        ? { color: 'blue darken-2', name: 'check_circle' }
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
      return api.service('frequency').create({
        teacher,
        practitionerId: id,
        classId: this.lesson._id,
      })
    },
    async submit() {
      const newSubscribers = filter(this.restitution, p => !p.restituting)
      if (newSubscribers.length) {
        await api.service('classrooms').patch(this.lesson._id, { practitioners: [...this.lesson.practitioners, ...newSubscribers] })
      }
      await Promise.all(this.everyAttendant.map(async person => this.createFrequency(person)))
      if (this.teacher._id) {
        await this.createFrequency(this.teacher._id, true)
      }
      await this.$store.commit('attendance/cleanStore')
      this.$router.push('/')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('classrooms/get', { id: params.id })
    await store.dispatch('practitioners/find')
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
    width: 60%;
  }
  .card.half {
    width: auto;
  }
}
</style>
