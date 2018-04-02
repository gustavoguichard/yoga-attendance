<template>
  <v-layout align-content-center align-center column  v-if="chooseList">
    <practitioners-list title="Adicionar praticante à aula" :query="chooseQuery" @selected="selected" :chooseList="true" />
    </practitioners-list>
    <page-cta icon="arrow_back" @click.stop="toggleChooseList" />
  </v-layout>
  <v-layout align-content-center align-center column v-else>
    <page-title icon="person"
      :title="peopleList.classRoom.title"
      :subtitle="substitution(peopleList) && `Professor: ${peopleList.teacher.displayName} (substituindo: ${peopleList.classRoom.teacher.displayName})`"
      :picture="peopleList.teacher && peopleList.teacher.picture"
    />
    <v-btn @click.stop="toggleChooseList('teacher')" color="primary" depressed>Trocar professor</v-btn>
    <v-card>
      <v-toolbar color="blue-grey lighten-1" dark>
        <v-toolbar-title>Alunos presentes:</v-toolbar-title>
      </v-toolbar>
      <v-list two-line subheader>
        <div v-for="(person, i) in peopleList.practitioners" :key="i">
          <v-divider></v-divider>
          <person-list-item :avatar="true" :person="person" property="displayName">
            <v-icon v-if="!isSubscribed(person)" slot="right" color="orange darken-4">compare_arrows</v-icon>
            <v-btn slot="right" @click.stop="remove(person)" flat icon><v-icon color="red darken-4">delete</v-icon></v-btn>
          </person-list-item>
        </div>
      </v-list>
    </v-card>
    <page-cta icon="person_add" @click.stop="toggleChooseList" />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { get, includes, map, reduce } from 'lodash'
import pageCta from '@/components/page-cta'
import pageTitle from '@/components/page-title'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  middleware: 'check-auth',
  components: { pageCta, pageTitle, personListItem, practitionersList },
  watchQuery: ['add'],
  computed: {
    ...mapState('frequency', ['peopleList']),
    chooseList() {
      return this.$route.query.add
    },
    chooseQuery() {
      const peopleIds = map(this.peopleList.practitioners, '_id')
      const query = { _id: { $nin: peopleIds } }
      return this.chooseList === 'teacher' ? { ...query, teacher: true } : query
    },
  },
  methods: {
    isSubscribed({ classRooms }) {
      return includes(classRooms, this.peopleList.classId)
    },
    substitution(item) {
      const hasTeacherId = get(item, 'classRoom.teacher._id')
      const differentTeacher = get(item, 'teacher._id') !== hasTeacherId
      return differentTeacher && hasTeacherId
    },
    toggleChooseList(add = 'practitioner') {
      const query = this.chooseList ? null : { add }
      this.$router.push({ query })
    },
    remove({ _id }) {
      const { practitioners } = this.peopleList
      const list = reduce(practitioners, (sum, curr) =>
        curr._id === _id ? sum : [...sum, curr._id]
        , [])
      this.updateFrequency({ practitioners: list })
    },
    async selected({ _id }) {
      if (this.chooseList === 'teacher') {
        this.updateFrequency({ teacher: _id })
        this.toggleChooseList()
      } else {
        const { practitioners } = this.peopleList
        await this.updateFrequency({ practitioners: [...map(practitioners, '_id'), _id] })
      }
    },
    async updateFrequency(data) {
      const { _id } = this.peopleList
      await this.$store.dispatch('auth/ensureAuth')
      await this.$store.dispatch('frequency/patch', { _id, ...data })
      return this.$store.dispatch('frequency/get', {
        id: _id,
        query: { populatePractitioners: true, populateClassroom: true },
      })
    },
  },
  async fetch({ store, ...context }) {
    await store.dispatch('auth/ensureAuth')
    await store.dispatch('frequency/get', {
      id: context.params.id,
      query: {
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