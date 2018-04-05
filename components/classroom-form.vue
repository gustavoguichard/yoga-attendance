<template>
  <practitioners-list v-if="chooseList" :practitioners="notPractitioners" title="Escolha o aluno" @selected="addPractitioner" :chooseList="true" :twoLine="true" />
  <v-card v-else>
    <v-toolbar color="blue-grey lighten-1" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editing.title" name="title" label="Título" prepend-icon="title" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" v-model="editing.tuition" name="tuition" label="Preço da aula avulsa" prepend-icon="attach_money" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            :items="teacherSelection"
            v-model="editing.teacher"
            item-text="displayName"
            item-value="_id"
            prepend-icon="person"
            label="Professor"
            single-line
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-switch slot="footer" :label="`É aula regular${editing.regularClass ? '' : '?'}`" v-model="editing.regularClass"></v-switch>
        </v-flex>
        <v-flex xs12>
          <v-divider class="my-3"></v-divider>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">people</v-icon>
            Alunos:
          </v-subheader>
          <v-list dense>
            <div v-for="person in practitionersList" :key="person._id">
              <person-list-item :avatar="true" :person="person" @click="">
                <v-icon slot="right" @click="removePractitioner(person)" color="orange darken-4">delete</v-icon>
              </person-list-item>
            </div>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.stop="$router.push('?add=practitioner')" icon depressed color="primary">
              <v-icon>person_add</v-icon>
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
      <page-cta @click="submit" icon="check" />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { filter, includes, uniq, without } from 'lodash'
import pageCta from '@/components/page-cta'
import practitionersList from '@/components/practitioners-list'
import personListItem from '@/components/person-list-item'

export default {
  components: { pageCta, personListItem, practitionersList },
  watchQuery: ['add'],
  props: ['lesson', 'title'],
  data: () => ({
    editing: {
      title: '',
      tuition: undefined,
      teacher: undefined,
      practitioners: [],
      regularClass: true,
    },
  }),
  computed: {
    ...mapGetters('practitioners', ['teachers']),
    ...mapState('practitioners', ['list']),
    chooseList() {
      return !!this.$route.query.add
    },
    practitionersList() {
      return filter(this.list, person => includes(this.editing.practitioners, person._id))
    },
    teacherSelection() {
      return [{ _id: null, displayName: 'Sem professor definido' }, ...this.teachers]
    },
    notPractitioners() {
      return filter(this.list, person =>
        !includes(this.editing.practitioners, person._id)
        && (!this.editing.teacher || (person._id !== this.editing.teacher._id))
      )
    },
  },
  methods: {
    addPractitioner({ _id }) {
      this.editing.practitioners = uniq([...this.editing.practitioners, _id])
    },
    removePractitioner({ _id }) {
      this.editing.practitioners = without(this.editing.practitioners, _id)
    },
    submit() {
      this.$emit('submit', this.editing)
    },
  },
  mounted() {
    this.editing = {
      ...this.editing,
      ...this.lesson,
    }
  },
};
</script>
