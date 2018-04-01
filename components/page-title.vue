<template>
  <div class="text-xs-center grey--text text--darken-2 mb-4 mt-2">
    <v-avatar v-if="icon || picture" class="mb-2" size="100">
      <img v-if="picture" :src="picture" alt="Professor" />
      <v-icon v-else>{{ icon }}</v-icon>
    </v-avatar>
    <h2 class="headline">{{ title }}</h2>
    <span v-if="subtitle" class="subheading grey--text">{{ subtitle }}</span>
  </div>
</template>

<script>
export default { props: ['icon', 'picture', 'title', 'subtitle'] }
</script>
