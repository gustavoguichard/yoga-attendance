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
        <p class="text-xs-center">
          <v-avatar size="80" class="grey lighten-4 my-2" @click="pickFile" style="cursor: pointer">
            <img v-if="editingPerson.picture" :src="editingPerson.picture" alt="avatar">
            <v-icon v-else alt="avatar">person</v-icon>
          </v-avatar>
        </p>
        <input style="display: none" type="file" accept="image/*" ref="fileInput" @change="onFileChange">
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
          :key="lesson.title"
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
/* global FileReader */
import { mapState } from 'vuex'

export default {
  props: ['person', 'save'],
  data: () => ({
    editingPerson: {
      fullName: '',
      email: '',
      phone: '',
      birthdate: '',
      picture: '',
      teacher: false,
      classRooms: [],
    },
  }),
  computed: {
    ...mapState('classrooms', ['classes']),
  },
  methods: {
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
