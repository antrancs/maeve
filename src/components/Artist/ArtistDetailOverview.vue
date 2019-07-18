<template>
  <div v-if="resourcesdata.length > 0">
    <content-section v-for="resource in resourcesdata" :key="resource.title">
      <template #section-header>
        {{ resource.title }}
      </template>

      <template
        #section-header-right
        v-if="
          (resource.items.length >= 8 && resource.type !== 'artists') ||
            resource.type === 'songs'
        "
      >
        <router-link
          :to="{
            name: 'artistsViewAll',
            params: {
              resource: resource.name,
              id: artist.id,
              s: resource.s
            }
          }"
          class="link"
          >View all</router-link
        >
      </template>

      <template #section-content>
        <SongListSmall
          v-if="resource.type === 'songs'"
          :songs="resource.items"
          :sourceInfo="{
            name: `${artist.name}'s top songs`,
            path: {
              name: 'artists',
              params: {
                id: artist.id
              }
            }
          }"
        />
        <ArtistList
          v-else-if="resource.type === 'artists'"
          :artists="resource.items"
          :itemSizes="itemSizes"
        />
        <SongCollectionList
          v-else-if="$vuetify.breakpoint.mdAndUp"
          :itemSizes="itemSizes"
          :collections="resource.items"
        />
        <CollectionCarousel v-else :collections="resource.items" />
      </template>
    </content-section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component, Watch } from 'vue-property-decorator';

import SongListSmall from '@/components/Song/SongListSmall.vue';
import ArtistList from '@/components/ArtistList.vue';
import { Action } from 'vuex-class';
import {
  FETCH_MULTIPLE_SONGS_CATALOG,
  FETCH_MULTILE_ALBUMS_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  FETCH_MULTIPLE_ARTISTS_CATALOG
} from '../../store/actions.type';
import {
  FetchMultipleSongsCatalogAction,
  FetchMultipleAlbumsCatalogAction,
  FetchMultiplePlaylistsCatalogAction,
  FetchMultipleArtitsCatalogAction
} from '../../store/types';

@Component({
  components: {
    SongCollectionList: () =>
      import('@/components/Song/SongCollectionList.vue'),
    SongListSmall,
    ArtistList,
    CollectionCarousel: () =>
      import('@/components/Collection/CollectionCarousel.vue')
  }
})
export default class ArtistDetailOverview extends Vue {
  private resourcesdata: any[] = [];

  @Prop() resources!: any[];
  @Prop() artist!: any;
  @Prop() hasBanner!: boolean;

  @Action [FETCH_MULTIPLE_SONGS_CATALOG]: FetchMultipleSongsCatalogAction;
  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  @Action [FETCH_MULTIPLE_ARTISTS_CATALOG]: FetchMultipleArtitsCatalogAction;

  get itemSizes() {
    if (this.hasBanner) {
      return ['xl3', 'lg3', 'md-5-col', 'sm3', 'xs6'];
    }
    return ['xl-7-col', 'lg2', 'md-5-col', 'sm3', 'xs6'];
  }

  @Watch('resources')
  onResourcesChanged() {
    this.$_getData();
  }

  async $_getData() {
    const promises = this.resources.map(resource => {
      if (resource.type === 'songs') {
        return this.fetchMultipleSongsCatalog(resource.ids);
      } else if (resource.type === 'albums') {
        return this.fetchMultipleAlbumsCatalog(resource.ids);
      } else if (resource.type === 'artists') {
        return this.fetchMultipleArtistsCatalog(resource.ids);
      }
      return this.fetchMultiplePlaylistsCatalog(resource.ids);
    }) as Promise<any>[];
    const results = await Promise.all(promises);
    this.resourcesdata = this.resources.map((value, index) => {
      return {
        ...value,
        items: results[index]
      };
    });
  }
}
</script>
