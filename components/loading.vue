<template>
  <div v-if="active" class="loading-container">
    <v-progress-circular
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
  background: rgba(255, 255, 255, .7);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
</style>
