<template>
  <v-layout v-if="chooseList" justify-center wrap>
    <practitioners-list :practitioners="otherPractitioners" title="Escolha o praticante" @selected="addToLesson">
      <template slot="footer">
        <v-switch :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
        <v-spacer></v-spacer>
        <v-btn @click="toggleChooseList" flat color="primary">
          Voltar
        </v-btn>
      </template>
    </practitioners-list>
  </v-layout>
  <v-layout v-else justify-center wrap>
    <v-card>
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
            <v-icon slot="left" @click.stop="toggleRestituting(person)" :color="icon(person).color">{{ icon(person).name }}</v-icon>
          </person-list-item>
        </div>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.stop="toggleChooseList" flat color="primary">Adicionar</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
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
      const isSubscribed = person => includes(person.classRooms, this.lesson._id)
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
      this.$router.push({ query: false })
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
    toggleChooseList() {
      const query = this.chooseList ? null : { add: 'practitioner' }
      this.$router.push({ query })
    },
    async submit() {
      await this.$store.dispatch('auth/ensureAuth')
      const newSubscribers = filter(this.restitution, p => !p.restituting)
      if (newSubscribers.length) {
        await this.$store.dispatch('practitioners/subscribeToClass',
          { practitioners: newSubscribers, classId: this.lesson._id }
        )
      }
      await api.service('frequency').create({
        practitioners: this.everyAttendant,
        teacher: this.teacher._id,
        classId: this.lesson._id,
      })
      await this.$store.commit('attendance/cleanStore')
      this.$router.push('/')
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('classrooms/get', params.id)
    await store.dispatch('practitioners/find')
  },
};
</script>

<style scoped>
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
  }
}
</style>