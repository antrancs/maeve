<template>
  <v-snackbar
    top
    v-model="snackbar.visibility"
    :color="snackbar.type"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.text }}

    <v-btn flat dark @click="handleClick">{{
      snackbar.action ? snackbar.action.text : 'Close'
    }}</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';

import { SnackbarState } from '@/store/types';
import { CLOSE_SNACKBAR } from '@/store/actions.type';

@Component({})
export default class Snackbar extends Vue {
  @State snackbar!: SnackbarState;
  @Action [CLOSE_SNACKBAR]: () => void;

  handleClick() {
    if (this.snackbar.action) {
      this.snackbar.action.handler();
    } else {
      this.closeSnackbar();
    }
  }
}
</script>
