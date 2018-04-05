<template>
  <v-card>
    <v-toolbar color="blue-grey lighten-1" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            :items="typeOptions"
            v-model="editing.type"
            item-text="text"
            item-value="value"
            prepend-icon="all_inclusive"
            label="Escolha um tipo"
            single-line
          ></v-select>
        </v-flex>
      </v-layout>
        <v-flex xs12>
          <v-select
            :items="classesOptions"
            v-model="editing.classroom"
            item-text="title"
            item-value="_id"
            prepend-icon="event"
            label="Aulas Regulares"
            single-line
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-divider class="my-3"></v-divider>
          <v-subheader class="pl-0">
            <v-icon class="mr-1">monetization_on</v-icon>
            Precificação:
          </v-subheader>
          <template v-for="(option, i) in editing.pricing">
            <v-divider class="mt-2 mb-2 pt-2"></v-divider>
            <v-text-field @keyup.enter="submit" :value="option.desc" @input="changePricing('desc', i, $event)" name="desc" label="Descrição" prepend-icon="title" required></v-text-field>
            <v-text-field @keyup.enter="submit" :value="option.value" @input="changePricing('value', i, $event)" name="value" label="Valor" prepend-icon="attach_money" required></v-text-field>
            <v-text-field type="number" @keyup.enter="submit" :value="option.amount" @input="changePricing('amount', i, $event)" name="amount" label="Aulas / mês" prepend-icon="more_horiz"></v-text-field>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.stop="addPricing" icon depressed color="primary">
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
import { mapState } from 'vuex'
import { map, filter } from 'lodash'
import pageCta from '@/components/page-cta'

const blankPricing = () => ({
  desc: '',
  value: 0,
  amount: 0,
})

export default {
  components: { pageCta },
  props: ['enrollment', 'title'],
  data: () => ({
    editing: {
      type: '',
      classroom: undefined,
      pricing: [blankPricing()],
    },
  }),
  computed: {
    ...mapState('classrooms', ['classes']),
    typeOptions() {
      return [
        { text: 'Mensal', value: 'monthly' },
        { text: 'Anual', value: 'yearly' },
      ]
    },
    classesOptions() {
      return [{ _id: null, title: 'Aulas Regulares' }, ...this.classes]
    },
  },
  methods: {
    addPricing() {
      this.editing.pricing = [...this.editing.pricing, blankPricing()]
    },
    changePricing(field, index, value) {
      this.editing.pricing = map(this.editing.pricing, (opt, i) => {
        if (i === index) {
          opt = { ...opt, [field]: value }
        }
        return opt
      })
    },
    submit() {
      const enrollment = { ...this.editing, pricing: filter(this.editing.pricing, p => p.desc !== '') }
      this.$emit('submit', enrollment)
    },
  },
  mounted() {
    this.editing = {
      ...this.editing,
      ...this.enrollment,
    }
  },
};
</script>
