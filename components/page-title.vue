<template>
  <div :class="{'text-xs-center grey--text text--darken-2': true, 'mb-4 mt-2': !noMargin }">
    <v-avatar v-if="icon || avatar" class="mb-2" size="100">
      <img v-if="avatar" :src="avatar" alt="Professor" />
      <v-icon x-large v-else>{{ icon }}</v-icon>
    </v-avatar>
    <h2 class="headline">{{ title }}</h2>
    <span v-if="subtitle" class="subheading grey--text">{{ subtitle }}</span>
  </div>
</template>

<script>
export default { props: ['icon', 'avatar', 'title', 'subtitle', 'no-margin'] }
</script>

<style scoped>
.icon {
  font-size: 100px !important;
}
</style>
