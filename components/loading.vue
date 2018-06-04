<template>
  <div v-if="active" class="loading-container">
    <div class="progress-wrapper" />
    <v-progress-circular
      class="progress"
      :size="100"
      :width="15"
      indeterminate
      color="primary"
    />
  </div>
</template>

<script>
export default { props: ['active'] }
</script>

<style scoped>
.loading-container {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  max-height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
.progress {
  position: fixed;
}
.progress-wrapper {
  background: rgba(255, 255, 255, .7);
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
</style>
