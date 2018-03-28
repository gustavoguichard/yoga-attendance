<template>
  <v-list-tile router :to="'/turmas/' + lesson._id" :avatar="icon">
    <v-list-tile-avatar v-if="icon">
      <v-icon>group</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{ lesson.title }}</v-list-tile-title>
      <v-list-tile-sub-title v-if="lesson.description" v-html="lesson.description" />
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
export default {
  props: ['lesson', 'icon'],
};
</script>
