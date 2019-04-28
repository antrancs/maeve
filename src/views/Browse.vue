<template>
  <v-container>
    <v-layout row wrap v-if="categoryData">
      <v-flex xs12 class="px-2">
        <section-header>{{ categoryData.name }}</section-header>
      </v-flex>

      <v-flex xs12>
        <SongCollectionList :collections="categoryData.playlists" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import { Prop } from 'vue-property-decorator';
import { getOneBrowseCategory } from '../services/catalog.service';

@Component({
  components: {
    SongCollectionList
  }
})
export default class Browse extends Vue {
  private categoryData: any = null;

  @Prop() resource!: string;

  created() {
    this.$_fetchData();
  }

  async $_fetchData() {
    const category = await getOneBrowseCategory(this.resource);
    if (category && Object.keys(category).length > 0) {
      this.categoryData = category;
    }
  }
}
</script>
