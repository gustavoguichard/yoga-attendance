<template>
  <practitioners-list v-if="chooseList" :query="possibleFamilyQuery" title="Escolha o familiar" @selected="addFamily" :chooseList="true" />
  <v-card v-else>
    <v-toolbar color="blue-grey lighten-1" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editingPerson.fullName" name="fullName" label="Nome completo" prepend-icon="perm_identity" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editingPerson.nickName" name="nickName" label="Apelido" prepend-icon="face"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editingPerson.email" name="email" label="E-mail" prepend-icon="email" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-avatar size="80" class="grey lighten-4 mt-2 mb-4" @click="pickFile" style="cursor: pointer">
            <img v-if="editingPerson.picture" :src="editingPerson.picture" alt="avatar">
            <v-icon v-else alt="avatar">add_a_photo</v-icon>
          </v-avatar>
          <input style="display: none" type="file" accept="image/*" ref="fileInput" @change="onFileChange">
        </v-flex>
        <v-flex xs12>
          <v-checkbox color="blue" v-model="editingPerson.teacher" name="teacher" label="Professor"></v-checkbox>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="(##) #####-####" v-model="editingPerson.phone" name="phone" label="Telefone" prepend-icon="phone" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="##/##/####" v-model="editingPerson.birthdate" name="birthdate" label="Data de Nascimento" prepend-icon="cake" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">home</v-icon>
            Familiares:
          </v-subheader>
          <person-list-item v-for="person in editingPerson.family" :avatar="true" avatarSize="28" :person="person" :to="`/praticantes/${person._id}/edit`">
            <v-btn icon ripple slot="right" @click.stop="removeRelative(person)">
              <v-icon color="orange">delete</v-icon>
            </v-btn>
          </person-list-item>
          <v-btn color="blue" icon flat @click.stop="$router.push({ query: { add: 'relative' } })">
            <v-icon>group_add</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-subheader>Aulas inscritas:</v-subheader>
          <v-checkbox
            v-for="lesson in classes"
            :label="lesson.title"
            :key="lesson.title"
            v-model="editingPerson.classRooms"
            color="blue"
            :value="lesson._id"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
      <page-cta @click="submit" icon="check" />
    </v-card-text>
  </v-card>
</template>

<script>
/* global FileReader */
import { mapState } from 'vuex'
import { filter } from 'lodash'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'

export default {
  components: { pageCta, personListItem, practitionersList },
  watchQuery: ['add'],
  props: ['person', 'title', 'save'],
  data: () => ({
    editingPerson: {
      fullName: '',
      nickName: '',
      email: '',
      phone: '',
      birthdate: '',
      picture: '',
      family: [],
      teacher: false,
      classRooms: [],
    },
  }),
  computed: {
    ...mapState('classrooms', ['classes']),
    chooseList() {
      return !!this.$route.query.add
    },
    possibleFamilyQuery() {
      const alreadyMembers = [...this.editingPerson.family, this.editingPerson._id]
      return { _id: { $nin: alreadyMembers } }
    },
  },
  methods: {
    addFamily(person) {
      this.editingPerson.family = [...this.editingPerson.family, person]
    },
    removeRelative({ _id }) {
      this.editingPerson.family = filter(this.editingPerson.family, p => p._id !== _id)
    },
    onFileChange(ev) {
      ev.preventDefault()
      const reader = new FileReader()
      const file = ev.target.files[0]

      reader.onloadend = () => {
        this.editingPerson.picture = reader.result
      }

      reader.readAsDataURL(file)
    },
    pickFile() {
      this.$refs.fileInput.click()
    },
    submit() {
      this.$emit('submit', this.editingPerson)
    },
  },
  mounted() {
    this.editingPerson = {
      ...this.editingPerson,
      ...this.person,
    }
  },
};
</script>
