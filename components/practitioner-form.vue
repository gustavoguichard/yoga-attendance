<template>
  <v-card-text>
    <v-layout wrap>
      <v-flex xs12>
        <v-text-field @keyup.enter="submit" v-model="editingPerson.fullName" name="fullName" label="Nome completo" prepend-icon="perm_identity" required></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field @keyup.enter="submit" v-model="editingPerson.email" name="email" label="E-mail" prepend-icon="email" required></v-text-field>
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
        <v-checkbox
          v-for="lesson in classes"
          :label="lesson.title"
          v-model="editingPerson.classRooms"
          color="blue"
          :value="lesson._id"
          hide-details
        ></v-checkbox>
      </v-flex>
    </v-layout>
    <v-btn color="blue" dark fab fixed bottom right @click="submit">
      <v-icon>check</v-icon>
    </v-btn>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['person', 'save'],
  data: () => ({
    editingPerson: {
      fullName: '',
      email: '',
      phone: '',
      birthdate: '',
      teacher: false,
      classRooms: [],
    },
  }),
  computed: {
    ...mapState('classrooms', ['classes']),
  },
  methods: {
    submit() {
      this.save(this.editingPerson)
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
