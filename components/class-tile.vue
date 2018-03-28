<template>
  <v-list-tile avatar>
    <v-list-tile-action>
      <v-btn icon @click="openLesson(lesson)">
        <v-icon>group_add</v-icon>
      </v-btn>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ lesson.title }}</v-list-tile-title>
      <v-list-tile-sub-title v-if="lesson.description" v-html="lesson.description" />
    </v-list-tile-content>
    <v-list-tile-action>
      <v-btn icon @click="viewFrequency(lesson)">
        <v-icon>list</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ['lesson'],
  methods: {
    openLesson({ _id }) {
      this.$router.push(`/chamada/${_id}`)
    },
    viewFrequency({ _id }) {
      this.$router.push(`/presencas/${_id}`)
    },
  },
};
</script>
