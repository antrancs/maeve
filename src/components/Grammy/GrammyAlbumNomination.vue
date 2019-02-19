<template>
  <transition-group
    name="list"
    tag="div"
    class="layout row wrap"
    v-if="albums.length > 0"
  >
    <v-flex xs12 key="title">
      <div :class="$style['header']">
        <h2 class="px-2">{{ title }}</h2>

        <app-button @on-click="playAllAlbums">Play All</app-button>
      </div>
    </v-flex>
    <v-flex
      xs6
      sm3
      md3
      lg2
      class="pa-2"
      v-for="album in albums"
      :key="album ? album.id : `album-${Date.now()}`"
    >
      <template v-if="album">
        <LinkComponent
          v-if="album && album.attributes"
          routeName="albums"
          :routeParams="{ id: album.id }"
        >
          <CollectionItemCard :collection="album">
            <div
              v-if="winners.includes(album.id)"
              :class="$style['star-wrapper']"
              title="Winner"
            >
              <v-icon color="accent" medium>star</v-icon>
            </div>
          </CollectionItemCard>
        </LinkComponent>
      </template>
    </v-flex>
  </transition-group>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import LinkComponent from '@/components/LinkComponent.vue';
import CollectionItemCard from '@/components/CollectionItemCard.vue';
import { FETCH_MULTILE_ALBUMS_CATALOG, PLAY_SONGS } from '@/store/actions.type';
import {
  FetchMultipleAlbumsCatalogAction,
  PlaySongsAction
} from '@/store/types';

@Component({
  components: {
    CollectionItemCard,
    LinkComponent
  }
})
export default class GrammyAlbumNomination extends Vue {
  private albums: MusicKit.Album[] = [];

  @Prop() title!: string;
  @Prop() albumIds!: string[];
  @Prop() winners!: string[];

  @Action [FETCH_MULTILE_ALBUMS_CATALOG]: FetchMultipleAlbumsCatalogAction;
  @Action [PLAY_SONGS]: PlaySongsAction;

  created() {
    this.$_searchAlbums();
  }

  playAllAlbums() {
    // extract songs from all albums
    const songs = this.albums.reduce(
      (accumulate: MusicKit.Song[], currentAlbum) => {
        if (!currentAlbum.relationships) {
          return accumulate;
        }

        accumulate.push(...currentAlbum.relationships.tracks!.data);
        return accumulate;
      },
      []
    );

    this.playSongs({
      songs,
      startSongIndex: 0,
      songsSourceName: this.title
    });
  }

  async $_searchAlbums() {
    this.albums = await this.fetchMultipleAlbumsCatalog(this.albumIds);
  }
}
</script>

<style lang="scss" module>
.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.star-wrapper {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}
</style>
