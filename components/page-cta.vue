<template>
  <v-btn color="cyan darken-2" dark fab :fixed="!absolute" :absolute="absolute" bottom right @click.stop="clicked">
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: ['icon', 'to', 'absolute'],
  methods: {
    clicked(ev) {
      if (this.to) {
        this.$router.push(this.to)
      }
      this.$emit('click', ev)
    },
  },
}
</script>
