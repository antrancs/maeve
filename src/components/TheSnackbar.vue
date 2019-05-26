<template>
  <v-snackbar
    bottom
    v-model="snackbar.visibility"
    :color="snackbar.type"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.text }}

    <v-spacer />
    <v-btn
      v-if="snackbar.action"
      flat
      dark
      @click.native="snackbar.action.handler"
      >{{ snackbar.action.text }}</v-btn
    >

    <v-btn flat dark @click="closeSnackbar">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import { SnackbarState } from '@/store/types';
import { CLOSE_SNACKBAR } from '@/store/actions.type';

@Component
export default class Snackbar extends Vue {
  @State snackbar!: SnackbarState;
  @Action [CLOSE_SNACKBAR]: () => void;
}
</script>
