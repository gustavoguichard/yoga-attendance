<template>
  <div :class="{'text-xs-center grey--text text--darken-2': true, 'mb-4 mt-2': !noMargin }">
    <v-avatar v-show="avatar" class="mb-2" size="100">
      <img :src="avatar" alt="Professor" />
    </v-avatar>
    <v-icon x-large v-show="!avatar && icon">{{ icon }}</v-icon>
    <h2 class="headline">{{ title }}</h2>
    <span v-if="subtitle" class="subheading grey--text">{{ subtitle }}</span>
  </div>
</template>

<script>
export default { props: ['icon', 'avatar', 'title', 'subtitle', 'no-margin'] }
</script>

<style scoped>
.icon {
  font-size: 60px !important;
}
</style>
