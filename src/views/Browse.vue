<template>
  <v-container>
    <content-section v-if="categoryData">
      <template #section-header>
        {{ categoryData.name }}
      </template>

      <template #section-content>
        <SongCollectionList :collections="categoryData.playlists" />
      </template>
    </content-section>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { getOneBrowseCategory } from '../services/catalog.service';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

@Component({
  components: {
    SongCollectionList
  }
})
export default class Browse extends Mixins(DataLoadingMixin) {
  private categoryData: any = null;

  @Prop() resource!: string;

  created() {
    this.$_fetchData();
  }

  async $_fetchData() {
    const category = await getOneBrowseCategory(this.resource);
    if (category && Object.keys(category).length > 0) {
      this.categoryData = category;
      this.dataLoadingDone();
    }
  }
}
</script>
