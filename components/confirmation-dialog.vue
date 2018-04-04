<template>
  <v-dialog v-model="open" max-width="290">
    <slot slot="activator"></slot>
    <v-card>
      <v-card-title class="headline">Tem certeza?</v-card-title>
      <v-card-text>Ao deletar esse dado, você pode acabar gerando inconsistências no programa.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="open = false">Cancelar</v-btn>
        <v-btn color="red darken-1" flat @click.native="clicked">Tenho certeza</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    open: false,
  }),
  methods: {
    clicked(ev) {
      this.$emit('click', ev)
      this.open = false
    },
  },
};
</script>
