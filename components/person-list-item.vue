<template>
  <v-list-tile ripple :avatar="!!avatar" :style="disabled && 'pointer-events: none;'" @click.stop="clicked">
    <v-list-tile-avatar :size="avatarSize" v-if="!!avatar && avatar !== 'right'">
      <img v-if="person.picture" :src="person.picture" />
      <v-icon v-else>person</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-action v-if="$slots['left']">
      <slot name="left"></slot>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title v-if="property">
        {{ person[property] }}
      </v-list-tile-title>
      <v-list-tile-title v-else>
        <span v-if="person.nickName">
          {{ person.nickName }}
          <em class="grey--text"> - {{ person.fullName }}</em>
        </span>
        <span v-else>{{ person.fullName }}</span>
      </v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-avatar :size="avatarSize" v-if="!!avatar && avatar === 'right'">
      <img v-if="person.picture" :src="person.picture" />
      <v-icon v-else>person</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-action v-if="$slots['right']">
      <slot name="right"></slot>
    </v-list-tile-action>
  </v-list-tile>

</template>

<script>
import { isString } from 'lodash'

export default {
  props: ['person', 'avatar', 'avatarSize', 'to', 'property', 'disabled'],
  computed: {
    isString() {
      return isString(this.person)
    },
  },
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
