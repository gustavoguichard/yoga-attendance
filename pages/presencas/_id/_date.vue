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
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(freq, i) in practitionersFreq" :key="i">
          <v-divider></v-divider>
          <person-list-item :avatar="true" :person="freq.practitioner" property="displayName">
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
import { mapState } from 'vuex'
import { filter, find, get, includes, map } from 'lodash'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  middleware: 'check-auth',
  components: { pageCta, pageTitle, personListItem, practitionersList },
  watchQuery: ['add'],
  computed: {
    ...mapState('frequency', ['result']),
    chooseList() {
      return this.$route.query.add
    },
    classroom() {
      return get(this, 'result.data[0].classroom')
    },
    practitionersFreq() {
      return filter(this.result.data, f => f.practitionerId !== this.teacher._id)
    },
    taughtBy() {
      const temporary = find(this.result.data, f => f.teacher)
      return get(temporary, 'practitioner')
    },
    teacher() {
      return this.taughtBy || this.classroom.teacher
    },
    isSubstitution() {
      const { teacher } = this.classroom
      return teacher && (this.teacher._id !== teacher._id)
    },
    sample() {
      return get(this, 'result.data[0]')
    },
    chooseQuery() {
      const peopleIds = map(this.result.data, 'practitioner._id')
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
    async remove({ _id }) {
      await api.service('frequency').remove(_id)
      this.updateFrequency()
    },
    async selected({ _id }) {
      if (this.chooseList === 'teacher') {
        const currTeacher = find(this.result.data, f => f.teacher === true)
        const nextTeacher = find(this.result.data, f => f.practitionerId === _id)
        await (currTeacher
          && api.service('frequency').patch(currTeacher._id, { teacher: false }))
        await api.service('frequency').patch(nextTeacher._id, { teacher: true })
        this.toggleChooseList()
      } else {
        await api.service('frequency').create({
          ...this.sample,
          _id: null,
          practitionerId: _id,
          teacher: false,
        })
        this.updateFrequency()
      }
    },
    async updateFrequency() {
      const { date, id } = this.$route.params
      return this.$store.dispatch('frequency/find', {
        query: {
          classId: id,
          createdAt: {
            $gte: `${date} 00:00:00`,
            $lt: `${date} 23:59:59.999`,
          },
          populatePractitioners: true,
          populateClassroom: true,
        },
      })
    },
  },
  async fetch({ store, params }) {
    const { id, date } = params
    await store.dispatch('frequency/find', {
      query: {
        classId: id,
        createdAt: {
          $gte: `${date} 00:00:00`,
          $lt: `${date} 23:59:59.999`,
        },
        populatePractitioners: true,
        populateClassroom: true,
      },
    })
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
}
</style>
