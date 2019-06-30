<template>
  <v-container>
    <content-section>
      <template #section-header>
        {{ genreDetailName }}
      </template>

      <template #section-content>
        <SongCollectionList
          v-if="collections.length > 0"
          :collections="collections"
        />
        <SongListLarge
          v-if="songs.length > 0 && genreDetailName"
          :songs="songs"
          :sourceInfo="{
            name: genreDetailName,
            path: {
              name: 'genresViewAll',
              params: {
                id,
                resource
              }
            }
          }"
        />
      </template>
    </content-section>
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import { Collection, Nullable } from '@/@types/model/model';
import { FETCH_MULTIPLE_SONGS_CATALOG } from '@/store/actions.type';
import { FetchMultipleSongsCatalogAction } from '@/store/types';
import { GENRES, Genre } from '@/utils/constants';
import { getGenreOneResource } from '../services/catalog.service';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

@Component({
  components: {
    SongListLarge: () => import('@/components/Song/SongListLarge.vue'),
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class GenreDetailViewAll extends Mixins(DataLoadingMixin) {
  private songs: MusicKit.Song[] = [];
  private collections: (MusicKit.Album | MusicKit.Playlist)[] = [];
  private genreDetailName = '';

  @Prop() id!: string;
  @Prop() resource!: string;

  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;

  created() {
    this.$_fetchData();
  }

  async $_fetchData() {
    const result = await getGenreOneResource(this.id, this.resource);

    if (!result || Object.keys(result).length === 0) {
      return;
    }

    this.genreDetailName = result.name;
    if (this.resource === 'hot-tracks') {
      if (result.data.length > 0) {
        this.songs = await this.fetchMultipleSongsCatalog(result.data);
      }
    } else {
      this.collections = result.data;
    }
    this.dataLoadingDone();
  }
}
</script>
