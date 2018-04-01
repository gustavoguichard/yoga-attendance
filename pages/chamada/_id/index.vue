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
          <person-list-item avatar="right" :person="person" @click="toggle(person)">
            <v-icon slot="left" @click.stop="toggleRestituting(person)" :color="icon(person).color">{{ icon(person).name }}</v-icon>
          </person-list-item>
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
          <person-list-item :person="teacher" property="displayName" @click="selectTeacher(teacher)" avatar="right">
            <v-list-tile-action slot="left">
              <v-icon v-if="isTeacher(teacher)" color="yellow darken-2">star</v-icon>
            </v-list-tile-action>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Adicione um praticante à turma</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 600px; overflow: scroll;">
          <v-list dense>
            <person-list-item v-for="person in otherPractitioners" :key="person._id" :person="person" @click="addToLesson(person)" avatar="right" />
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-switch :label="`Reposição${restituting ? '' : '?'}`" v-model="restituting"></v-switch>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <page-cta @click="submit()" icon="done_all" />
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  concat, difference, findIndex, filter,
  includes, map, uniq, without
} from 'lodash'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'

export default {
  middleware: 'check-auth',
  components: { pageCta, personListItem },
  data() {
    return {
      dialog: false,
      selected: [],
      restitution: [],
      restituting: true,
      currentTeacher: undefined,
    }
  },
  methods: {
    addToLesson(person) {
      const { restituting } = this
      this.restitution = uniq([...this.restitution, { ...person, restituting }])
      this.dialog = false
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
      if (this.isRestituting(person)) {
        this.restitution = map(this.restitution, item =>
          item._id === person._id ? { ...item, restituting: !item.restituting } : item
        )
      }
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
@media (min-width: 800px) {
  .card {
    margin: 1em;
    min-width: 400px;
  }
}
</style>