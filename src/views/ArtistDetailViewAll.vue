<template>
  <v-container>
    <content-section>
      <template #section-header>
        {{ pageTitle }}
      </template>

      <template #section-content>
        <SongCollectionList
          v-if="collections.length > 0"
          :collections="collections"
        />
        <SongListLarge
          v-if="songs.length > 0"
          :songs="songs"
          :sourceInfo="{
            name: pageTitle,
            path: {
              name: 'artistsViewAll',
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
import { Prop, Component, Mixins } from 'vue-property-decorator';
import { getArtistOneResource } from '../services/catalog.service';
import { Action } from 'vuex-class';
import {
  FETCH_MULTIPLE_SONGS_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG
} from '../store/actions.type';
import {
  FetchMultipleSongsCatalogAction,
  FetchMultipleAlbumsCatalogAction,
  FetchMultiplePlaylistsCatalogAction
} from '../store/types';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

@Component({
  components: {
    SongListLarge: () => import('@/components/Song/SongListLarge.vue'),
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class ArtistDetailViewAll extends Mixins(DataLoadingMixin) {
  private artistName = '';
  private songs: MusicKit.Song[] = [];
  private collections: (MusicKit.Album | MusicKit.Playlist)[] = [];

  @Prop() id!: string;
  @Prop() resource!: string;
  @Prop() s!: number;

  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;

  created() {
    this.$_fetchData();
  }

  get pageTitle(): string {
    if (this.artistName.length === 0) {
      return '';
    }

    const formattedResource = this.resource
      .split('-')
      .map(str => this.$_capitalize(str))
      .join(' ');
    return `${this.artistName} - ${formattedResource}`;
  }

  $_capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async $_fetchData() {
    try {
      const result = await getArtistOneResource(this.id, this.s);

      if (!result || Object.keys(result).length === 0) {
        return;
      }

      const { artist, resources } = result;

      this.artistName = artist.name;
      if (resources.length === 0) {
        return;
      }

      switch (this.resource) {
        case 'songs':
          this.songs = await this.fetchMultipleSongsCatalog(resources);
          break;
        case 'albums':
        case 'singles':
        case 'compilations':
        case 'essential-albums':
          this.collections = await this.fetchMultipleAlbumsCatalog(resources);
          break;

        case 'playlists':
          this.collections = await this.fetchMultiplePlaylistsCatalog(
            resources
          );
      }
    } finally {
      this.dataLoadingDone();
    }
  }
}
</script>
