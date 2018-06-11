<template>
  <v-list-tile :class="{ tile: true, active }" v-if="person" ripple :avatar="!!avatar" :style="disabled && 'pointer-events: none;'" @click.stop="clicked">
    <v-list-tile-avatar :size="avatarSize" v-if="!!avatar && avatar !== 'right'">
      <img :src="person.avatar" />
    </v-list-tile-avatar>
    <v-list-tile-action class="tile__action" v-if="$slots['left']">
      <slot name="left"></slot>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title v-if="property">
        {{ person[property] }}
      </v-list-tile-title>
      <v-list-tile-title v-else="person">
        <span>
          {{ person.displayName }}
          <em class="grey--text"> - {{ person.surname }}</em>
        </span>
      </v-list-tile-title>
      <v-list-tile-sub-title v-if="showMail">{{ person.email }}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-avatar :size="avatarSize" v-if="!!avatar && avatar === 'right'">
      <img :src="person.avatar" />
    </v-list-tile-avatar>
    <v-list-tile-action v-if="$slots['right']">
      <slot name="right"></slot>
    </v-list-tile-action>
  </v-list-tile>

</template>

<script>
import { isString } from 'lodash'

export default {
  props: ['person', 'active', 'avatar', 'avatarSize', 'to', 'property', 'disabled', 'showMail'],
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

<style scoped>
@media only screen and (max-width: 599px) {
  .tile > a {
    padding: 0 8px;
  }

  .tile__action {
    min-width: 40px;
  }
}

.tile.active {
  background-color: aliceblue;
}
</style>
