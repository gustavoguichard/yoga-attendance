<template>
  <practitioners-list v-if="chooseList" :query="possibleFamilyQuery" title="Escolha o familiar" @selected="addFamily" :chooseList="true" :twoLine="true" />
  <v-card class="main-card" v-else>
    <v-toolbar>
      <v-toolbar-title>Preencha os campos abaixo</v-toolbar-title>
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
        <!-- <v-flex xs12>
          <v-avatar size="80" class="grey lighten-4 mt-2 mb-4" @click="pickFile" style="cursor: pointer">
            <img v-if="editing.picture" :src="editing.picture" alt="avatar">
            <v-icon v-else alt="avatar">add_a_photo</v-icon>
          </v-avatar>
          <input style="display: none" type="file" accept="image/*" ref="fileInput" @change="onFileChange">
        </v-flex> -->
        <v-flex xs12>
          <v-checkbox color="cyan darken-2" v-model="editing.teacher" name="teacher" label="Professor"></v-checkbox>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="(##) #####-####" v-model="editing.phone" name="phone" label="Telefone" prepend-icon="phone" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field @keyup.enter="submit" mask="##/##/####" :return-masked-value="true" v-model="editing.birthdate" name="birthdate" label="Data de Nascimento" prepend-icon="cake" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">home</v-icon>
            Familiares:
          </v-subheader>
          <person-list-item v-for="person in this.family" :key="person._id" :avatar="true" avatarSize="28" :person="person" :to="`/praticantes/${person._id}/edit`">
            <confirmation-dialog slot="right" @click.stop="removeRelative(person)">
              <v-btn icon ripple>
                <v-icon color="orange">delete</v-icon>
              </v-btn>
            </confirmation-dialog>
          </person-list-item>
          <v-btn color="cyan darken-2" icon flat @click.stop="$router.push({ query: { add: 'relative' } })">
            <v-icon>group_add</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-divider class="my-3"></v-divider>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">all_inclusive</v-icon>
            Matrículas:
          </v-subheader>
          <template v-for="(option, i) in editing.enrollments">
            <v-divider class="mt-2 mb-2 pt-2"></v-divider>
            <v-select
              :items="enrollmentOptions"
              :value="option.enrollmentId"
              @input="changeEnrollment('enrollmentId', i, $event)"
              item-text="name"
              item-value="_id"
              prepend-icon="autorenew"
              label="Tipo de matrícula"
              single-line
            ></v-select>
            <v-select
              v-if="option.enrollmentId"
              :items="enrollmentPricing(option)"
              :value="option.enrollmentPrice"
              @input="changeEnrollment('enrollmentPrice', i, $event)"
              item-text="display"
              item-value="_id"
              prepend-icon="autorenew"
              label="Opções"
              single-line
            ></v-select>
            <v-text-field @keyup.enter="submit" :value="option.discount" @input="changeEnrollment('discount', i, $event)" name="discount" label="Desconto" prepend-icon="card_membership"></v-text-field>
            <v-text-field @keyup.enter="submit" :value="option.note" @input="changeEnrollment('note', i, $event)" name="note" label="Observação" prepend-icon="note"></v-text-field>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.stop="addEnrollment" icon depressed dark color="cyan darken-3">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
      <page-cta @click="submit" icon="check" />
    </v-card-text>
  </v-card>
</template>

<script>
/* global FileReader */
import { mapGetters } from 'vuex'
import moment from 'moment'
import { get, find } from 'lodash'
import decorate from '@/utils/decorate-enrollment'
import { parsePractitioner } from '@/utils/form-helpers'
import pageCta from '@/components/page-cta'
import personListItem from '@/components/person-list-item'
import practitionersList from '@/components/practitioners-list'
import confirmationDialog from '@/components/confirmation-dialog'

const blankEnrollment = () => ({
  enrollmentId: null,
  enrollmentPrice: null,
  discount: '',
  note: '',
})

export default {
  components: { confirmationDialog, pageCta, personListItem, practitionersList },
  props: ['person'],
  data: () => ({
    editing: {
      fullName: '',
      nickName: '',
      email: '',
      phone: '',
      birthdate: '',
      picture: '',
      family: [],
      enrollments: [blankEnrollment()],
      teacher: false,
    },
  }),
  computed: {
    ...mapGetters({
      getClass: 'classrooms/get',
      find: 'enrollment/find',
    }),
    ...mapGetters({ findPractitioners: 'practitioners/sortedFind' }),
    chooseList() {
      return !!this.$route.query.add
    },
    enrollmentOptions() {
      const result = this.find().data
      return result.map(enrl => {
        const lesson = this.getClass(enrl.classId)
        return decorate(enrl, lesson)
      })
    },
    possibleFamilyQuery() {
      const alreadyMembers = [this.editing._id].concat(this.editing.family || [])
      return { _id: { $nin: alreadyMembers } }
    },
    family() {
      return this.person && this.person.family
        ? this.findPractitioners({ query: { _id: { $in: this.person.family } } })
        : []
    },
  },
  methods: {
    addFamily(person) {
      this.editing.family = [person._id].concat(this.editing.family || [])
      this.editing.save()
      this.$router.push({ query: null })
    },
    addEnrollment() {
      this.editing.enrollments = [blankEnrollment()].concat(this.editing.enrollments || [])
    },
    changeEnrollment(field, index, value) {
      this.editing.enrollments = this.editing.enrollments.map((opt, i) => {
        if (i === index) {
          opt = { ...opt, [field]: value }
        }
        return opt
      })
    },
    enrollmentPricing({ enrollmentId }) {
      const option = find(this.enrollmentOptions, opt => enrollmentId === opt._id)
      return get(option, 'pricing')
    },
    removeRelative({ _id }) {
      this.editing.family = this.editing.family.filter(p => p !== _id)
      this.editing.save()
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
      this.$emit('submit', parsePractitioner(this.editing))
    },
  },
  async mounted() {
    if (this.person) {
      const person = new this.$FeathersVuex.Practitioner(this.person)
      this.editing = person.clone()
      this.editing.birthdate = this.person
        ? moment(this.person.birthdate).format('DDMMYYYY')
        : undefined
    }
  },
};
</script>
