<template>
  <div>
    <v-avatar v-if="!online" size="24px">
      <v-icon color="red">wifi_off</v-icon>
    </v-avatar>
    <v-avatar v-if="syncing" size="24px" class="ml-2 indeterminate">
      <v-icon color="green">sync</v-icon>
    </v-avatar>
    <v-avatar v-else-if="pending" size="24px" class="ml-2">
      <v-icon color="orange">sync_problem</v-icon>
    </v-avatar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('offline', ['pending']),
    ...mapState('offline', ['syncing', 'frequency', 'practitioners']),
    ...mapState('ui', ['online']),
  },
  methods: {
    async saveCollection(collection, Model) {
      let result
      try {
        result = await Promise.all(collection.map(async item =>
          new this.$FeathersVuex[Model](item).save()
        ))
      } catch (error) {
        // this.$store.dispatch(
        // 'notification/info',
        // 'Ocorreram alguns erros e não foi possível salvar todos os dados'
        // )
        result = error.message
      }
      return Promise.resolve(result)
    },
    async uploadPending() {
      if (this.online) {
        this.$store.dispatch('offline/sync')
        await this.saveCollection(this.practitioners, 'Practitioner')
        await this.saveCollection(this.frequency, 'Frequency')
        this.$store.dispatch('offline/done')
      }
    },
  },
  mounted() {
    this.uploadPending()
  },
  watch: {
    online() {
      this.uploadPending()
    },
  },
};
</script>
