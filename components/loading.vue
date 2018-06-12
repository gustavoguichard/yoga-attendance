<template>
  <div :class="{ 'loading-container': true, active }">
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
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .7s;
  z-index: -1;
}
.active {
  opacity: 1;
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
