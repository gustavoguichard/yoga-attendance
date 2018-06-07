<template>
  <v-layout justify-center wrap>
    <v-card class="main-card">
      <v-toolbar>
        <v-toolbar-title>Selecione uma regra</v-toolbar-title>
      </v-toolbar>
      <v-list two-line>
        <template v-for="(enrollment, i) in enrollments">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-tile avatar @click="edit(enrollment)">
            <v-list-tile-avatar>
              <v-icon>settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ enrollment.className }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ enrollment.type }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <confirmation-dialog @click.stop="remove(enrollment)">
                <v-btn icon><v-icon color="orange darken-4">delete</v-icon></v-btn>
              </confirmation-dialog>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
    <page-cta icon="add" to="/matriculas/new" />
  </v-layout>
</template>

<script>
import { service } from '@/api'
import fetchService from '@/api/fetch'
import { mapGetters } from 'vuex'
import { map } from 'lodash'
import pageCta from '@/components/page-cta'
import confirmationDialog from '@/components/confirmation-dialog'
import decorate from '@/utils/decorate-enrollment'

export default {
  middleware: ['check-admin'],
  components: { pageCta, confirmationDialog },
  computed: {
    ...mapGetters('enrollment', ['find']),
    enrollments() {
      const result = this.find().data
      return map(result, decorate)
    },
  },
  methods: {
    edit({ _id }) {
      this.$router.push(`/matriculas/${_id}/edit`)
    },
    async remove(enrollment) {
      await service(this.$store, 'enrollment/remove', enrollment._id)
    },
  },
  async fetch({ store }) {
    await fetchService('enrollment')(store)
  },
};
</script>
