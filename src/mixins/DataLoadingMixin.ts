import { Component, Vue } from 'vue-property-decorator';

import { getLyrics } from '@/services/lyrics.service';

@Component
export default class DataLoadingMixin extends Vue {
  private dataLoading = false;

  dataLoadingDone() {
    this.dataLoading = true;

    this.$emit('ready');
  }
}
