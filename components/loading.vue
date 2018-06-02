<template>
  <div v-if="activeCtx || loading" :class="{'loading-container': true, 'contextual': contextual}">
    <v-progress-circular
      :size="100"
      :width="15"
      indeterminate
      color="primary"
    />
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  props: ['contextual', 'active'],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    activeCtx() {
      return !get(this.$nuxt, '$loading.loading') && this.active
    },
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>

<style scoped>
.loading-container {
  align-items: center;
  background: rgba(255, 255, 255, .7);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 99999;
}

.contextual {
  position: absolute;
  z-index: 2;
}
</style>
