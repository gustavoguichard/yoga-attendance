<template>
  <v-list-tile avatar @click="clicked(lesson)">
    <v-list-tile-action v-if="viewFrequency">
      <v-btn icon @click.stop="viewFrequency(lesson)">
        <v-icon>list</v-icon>
      </v-btn>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ lesson.title }}</v-list-tile-title>
      <v-list-tile-sub-title v-if="lesson.description" v-html="lesson.description" />
    </v-list-tile-content>
    <v-list-tile-action v-if="editClass">
      <v-btn icon @click.stop="editClass(lesson)">
        <v-icon color="grey">edit</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ['lesson', 'viewFrequency', 'editClass', 'openLesson', 'to'],
  methods: {
    clicked(lesson) {
      const path = this.to.replace(/:id/g, lesson._id)
      this.$router.push(path)
    },
  },
};
</script>
