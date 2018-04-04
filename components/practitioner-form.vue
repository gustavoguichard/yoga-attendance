<template>
  <practitioners-list v-if="chooseList" :query="possibleFamilyQuery" title="Escolha o familiar" @selected="addFamily" :chooseList="true" :twoLine="true" />
  <v-card v-else>
    <v-toolbar color="blue-grey lighten-1" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editing.fullName" name="fullName" label="Nome completo" prepend-icon="perm_identity" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editing.nickName" name="nickName" label="Apelido" prepend-icon="face"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editing.email" name="email" label="E-mail" prepend-icon="email" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-avatar size="80" class="grey lighten-4 mt-2 mb-4" @click="pickFile" style="cursor: pointer">
            <img v-if="editing.picture" :src="editing.picture" alt="avatar">
            <v-icon v-else alt="avatar">add_a_photo</v-icon>
          </v-avatar>
          <input style="display: none" type="file" accept="image/*" ref="fileInput" @change="onFileChange">
        </v-flex>
        <v-flex xs12>
          <v-checkbox color="blue" v-model="editing.teacher" name="teacher" label="Professor"></v-checkbox>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="(##) #####-####" v-model="editing.phone" name="phone" label="Telefone" prepend-icon="phone" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="##/##/####" v-model="editing.birthdate" name="birthdate" label="Data de Nascimento" prepend-icon="cake" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">home</v-icon>
            Familiares:
          </v-subheader>
          <person-list-item v-for="person in editing.family" :key="person._id" :avatar="true" avatarSize="28" :person="person" :to="`/praticantes/${person._id}/edit`">
            <confirmation-dialog slot="right" @click.stop="removeRelative(person)">
              <v-btn icon ripple>
                <v-icon color="orange">delete</v-icon>
              </v-btn>
            </confirmation-dialog>
          </person-list-item>
          <v-btn color="blue" icon flat @click.stop="$router.push({ query: { add: 'relative' } })">
            <v-icon>group_add</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-divider class="my-3"></v-divider>
          <v-subheader class="pl-0">
            Frequência:
          </v-subheader>
          <v-select
            :items="items"
            v-model="editing.attendances"
            label="Selecionar"
            item-text="label"
            item-value="value"
            prepend-icon="insert_chart"
            multiple
            single-line
          ></v-select>
          <v-text-field @keyup.enter="submit" v-model="editing.discount" name="discount" label="Acerto" prepend-icon="card_membership"></v-text-field>
        </v-flex>
      </v-layout>
      <page-cta @click="submit" icon="check" />
    </v-card-text>
  </v-card>
</template>

<script>
/* global FileReader */
import { filter } from 'lodash'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'
import confirmationDialog from '@/components/confirmation-dialog'

export default {
  components: { confirmationDialog, pageCta, personListItem, practitionersList },
  watchQuery: ['add'],
  props: ['person', 'title'],
  data: () => ({
    editing: {
      fullName: '',
      nickName: '',
      email: '',
      phone: '',
      birthdate: '',
      picture: '',
      family: [],
      teacher: false,
      discount: '',
      attendances: [],
    },
    items: [
      { label: '1x por semana', value: '1x' },
      { label: '2x por semana', value: '2x' },
      { label: '3x por semana', value: '3x' },
      { label: '4x por semana', value: '4x' },
      { label: '5x por semana', value: '5x' },
      { label: 'Aula terapêutica', value: '160' },
    ],
  }),
  computed: {
    chooseList() {
      return !!this.$route.query.add
    },
    possibleFamilyQuery() {
      const alreadyMembers = [...this.editing.family, this.editing._id]
      return { _id: { $nin: alreadyMembers } }
    },
  },
  methods: {
    addFamily(person) {
      this.editing.family = [...this.editing.family, person]
    },
    removeRelative({ _id }) {
      this.editing.family = filter(this.editing.family, p => p._id !== _id)
    },
    onFileChange(ev) {
      ev.preventDefault()
      const reader = new FileReader()
      const file = ev.target.files[0]

      reader.onloadend = () => {
        this.editing.picture = reader.result
      }

      reader.readAsDataURL(file)
    },
    pickFile() {
      this.$refs.fileInput.click()
    },
    submit() {
      this.$emit('submit', this.editing)
    },
  },
  mounted() {
    this.editing = {
      ...this.editing,
      ...this.person,
    }
  },
};
</script>
