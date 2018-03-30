<template>
  <v-layout justify-center wrap>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-btn icon @click="selectAll">
          <v-icon v-if="allSelected" color="blue darken-4">check_circle</v-icon>
          <v-icon v-else>check</v-icon>
        </v-btn>
        <v-btn color="blue" dark fab absolute right @click.stop="dialog = true">
          <v-icon>add</v-icon>
        </v-btn>
        <v-toolbar-title>Praticantes da turma</v-toolbar-title>
      </v-toolbar>
      <v-list dense subheader>
        <div v-for="person in listedPeople" :key="person._id">
          <v-list-tile avatar ripple @click="toggle(person)">
            <v-list-tile-action v-if="isRestituting(person)" @click.stop="toggleRestituting(person)">
              <v-icon v-if="person.restituting" color="orange darken-4">compare_arrows</v-icon>
              <v-icon v-else color="green darken-2">check_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-action v-else>
              <v-icon v-if="isSelected(person)" color="blue darken-2">check_circle</v-icon>
              <v-icon v-else color="grey lighten-1">check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ person.fullName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Professor</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <div v-for="(teacher, i) in teachers" :key="teacher._id">
          <v-divider v-if="i > 0"></v-divider>
          <v-list-tile avatar ripple @click="selectTeacher(teacher)">
            <v-list-tile-avatar>
              <img v-if="teacher.picture" :src="'/' + teacher.picture" />
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ teacher.fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="isTeacher(teacher)" color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Adicione um praticante à turma</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px; overflow: scroll;">
          <v-list dense>
            <v-list-tile v-for="person in otherPractitioners" :key="person._id" ripple @click="addToLesson(person)">
              <v-list-tile-content>
                <v-list-tile-title>{{ person.fullName }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-switch :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn color="blue" dark fab fixed bottom right @click="submit()">
      <v-icon>done_all</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  concat, difference, findIndex, filter,
  includes, map, uniq, without
} from 'lodash'

export default {
  middleware: 'check-auth',
  data() {
    return {
      dialog: false,
      selected: [],
      restitution: [],
      restituting: false,
      currentTeacher: undefined,
    }
  },
  methods: {
    addToLesson(person) {
      const { restituting } = this
      this.restitution = uniq([...this.restitution, { ...person, restituting }])
      this.dialog = false
    },
    toggle(person) {
      if (this.isRestituting(person)) {
        this.restitution = filter(this.restitution, record => record._id !== person._id)
      } else {
        const fn = this.isSelected(person) ? without : concat
        const newList = fn(this.selected, person._id)
        this.selected = uniq(newList)
      }
    },
    toggleRestituting(person) {
      const restitution = without(this.restitution, person)
      this.restitution = [...restitution, { ...person, restituting: !person.restituting }]
    },
    isSelected(person) {
      const index = findIndex(this.selected, id => id === person._id)
      return index >= 0
    },
    isRestituting(person) {
      return includes(map(this.restitution, '_id'), person._id)
    },
    isntTeaching(person) {
      return person._id !== this.teacher._id
    },
    selectAll() {
      this.selected = this.allSelected ? [] : map(this.subscribedPractitioners, '_id')
    },
    selectTeacher(teacher) {
      this.currentTeacher = teacher
    },
    isTeacher(teacher) {
      return teacher._id === this.teacher._id
    },
    async submit() {
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('practitioners/subscribeToClass', {
        practitioners: filter(this.restitution, p => !p.restituting),
        classId: this.lesson._id,
      })
      await this.$store.dispatch('classrooms/addAttendance', {
        practitioners: this.everyAttendant,
        teacher: this.teacher._id,
        classId: this.lesson._id,
      })
      this.$router.push('/')
    },
  },
  computed: {
    ...mapGetters('practitioners', ['teachers']),
    ...mapState('practitioners', ['list']),
    ...mapState('classrooms', ['lesson']),
    allSelected() {
      return this.subscribedPractitioners.length === this.selected.length
    },
    everyAttendant() {
      return [...this.selected, ...map(this.restitution, '_id')]
    },
    subscribedPractitioners() {
      const isSubscribed = person => includes(person.classRooms, this.lesson._id)
      return filter(this.list, person =>
        isSubscribed(person) && this.isntTeaching(person)
      )
    },
    listedPeople() {
      return [...this.subscribedPractitioners, ...this.restitution]
    },
    otherPractitioners() {
      const notSubscribed = difference(this.list, this.subscribedPractitioners)
      return filter(notSubscribed, p =>
        !includes(map(this.restitution, '_id'), p._id) && this.isntTeaching(p)
      )
    },
    teacher() {
      return this.currentTeacher || this.lesson.teacher || { _id: null }
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
.card {
  margin: 1em;
  min-width: 400px;
}
</style>