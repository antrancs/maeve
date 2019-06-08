<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <WorldMap
        @zoom-in="handleMapZoomIn"
        @zoom-out="handleMapZoomOut"
        ref="worldMap"
      />

      <div
        class="world-playlist-wrapper elevation-8"
        :style="worldPlaylistWrapperStyle"
      >
        <v-btn dark @click="close" title="Close" class="close-btn" icon>
          <v-icon>close</v-icon>
        </v-btn>
        <template v-if="playlist">
          <div style="position: relative">
            <CollectionHeader
              class="px-2 py-4"
              :collection="playlist"
              :artworkSize="150"
              :songs="songs"
            />
            <router-link
              :to="{ name: 'playlists', params: { id: playlist.id } }"
            >
              <v-btn dark title="Go to detail" class="go-to-detail-btn" icon>
                <v-icon>arrow_forward_ios</v-icon>
              </v-btn>
            </router-link>
          </div>
          <ChartSongList
            :songs="songs"
            :collectionId="playlist.id"
            :onSongClicked="handleSongClicked"
          />
        </template>

        <h3 v-else-if="playlist === null" class="pa-3">
          Can't find Top 100 playlist for {{ countryName }}
        </h3>
      </div>
    </template>

    <div v-else>
      <content-section>
        <template #section-header>
          Top playlists
        </template>

        <template #section-content>
          <SongCollectionList :collections="playlists" />
        </template>
      </content-section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';

import { DAILY_TOP_100_COUNTRY_MAP } from '@/utils/constants';
import CollectionHeader from '@/components/Collection/CollectionHeader.vue';
import ChartSongList from '@/components/Song/ChartSongList.vue';
import {
  FETCH_ONE_PLAYLIST_CATALOG,
  FETCH_MULTIPLE_PLAYLISTS_CATALOG,
  // PLAY_COLLECTION,
  PLAY_SONGS
} from '@/store/actions.type';
import {
  FetchOnePlaylistCatalogAction,
  FetchMultiplePlaylistsCatalogAction,
  // PlayCollectionAction,
  PlaySongsAction
} from '@/store/types';
import { Nullable } from '@/@types/model/model';
import { SET_FOOTER_VISIBILITY } from '@/store/mutations.type';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { getSongsFromCollection } from '@/utils/utils';

@Component({
  components: {
    WorldMap: () => import('./WorldMap.vue'),
    ChartSongList,
    CollectionHeader,
    SongCollectionList: () => import('@/components/Song/SongCollectionList.vue')
  }
})
export default class ChartsByCountry extends Vue {
  private playlist: Nullable<MusicKit.Playlist> = null;
  private worldPlaylistWrapperStyle: any = {
    height: 0,
    top: '100%'
  };

  private countryName = '';
  private countryId: Nullable<string> = null;
  private topCountries = ['us', 'ca', 'gb', 'mx', 'kr', 'cn', 'au', 'fr'];
  private playlists: MusicKit.Playlist[] = [];

  @State(state => state.layout.showFooter) showFooter!: boolean;

  @Action [FETCH_ONE_PLAYLIST_CATALOG]: FetchOnePlaylistCatalogAction;
  @Action
  [FETCH_MULTIPLE_PLAYLISTS_CATALOG]: FetchMultiplePlaylistsCatalogAction;
  // @Action [PLAY_COLLECTION]: PlayCollectionAction;
  @Action [PLAY_SONGS]: PlaySongsAction;

  get topPlaylistIds(): string[] {
    return this.topCountries.map(country => DAILY_TOP_100_COUNTRY_MAP[country]);
  }

  get numberOfSongs(): number {
    return this.songs.length;
  }

  get songs() {
    return getSongsFromCollection(this.playlist);
  }

  get collectionName(): string {
    if (!this.playlist || !this.playlist.attributes) {
      return '';
    }
    return this.playlist.attributes.name;
  }

  get collectionArtistName(): Nullable<string> {
    if (!this.playlist || !this.playlist.attributes) {
      return '';
    }

    // artistName is only available for album
    return this.playlist.attributes.curatorName;
  }

  created() {
    // only fetch pre-defined playlists for small devices
    if (this.$vuetify.breakpoint.smAndDown) {
      this.fetchMultiplePlaylistsCatalog(this.topPlaylistIds).then(
        playlists => {
          this.playlists = playlists;
        }
      );
    }
  }

  handleMapZoomIn(country: { name: string; a2: string }) {
    this.countryName = country.name;
    this.countryId = country.a2;

    const playlistId = DAILY_TOP_100_COUNTRY_MAP[country.a2.toLowerCase()];

    if (!playlistId) {
      this.playlist = null;
      this.worldPlaylistWrapperStyle = {
        top: 0,
        height: '100%'
      };
      return;
    } else {
      this.playlist = undefined;
    }

    this.fetchOnePlaylistCatalog(playlistId).then(playlist => {
      this.playlist = playlist;

      let color: string = this.$vuetify.theme.accent as string;
      if (this.playlist.attributes && this.playlist.attributes.artwork) {
        const { artwork } = this.playlist.attributes;
        if (artwork.textColor1) {
          color = `#${artwork.textColor1}`;
        }
        if (artwork.textColor2) {
          color += `,#${artwork.textColor2}`;
        }
        if (artwork.textColor3) {
          color += `,#${artwork.textColor3}`;
        }
      }

      const background = `linear-gradient(to top, ${color}`;
      this.worldPlaylistWrapperStyle = {
        top: 0,
        height: '100%',
        background
      };
    });
  }

  handleMapZoomOut() {
    this.playlist = undefined;
    this.countryId = null;
    this.worldPlaylistWrapperStyle = {
      ...this.worldPlaylistWrapperStyle,
      top: '100%',
      height: 0
    };
  }

  close() {
    if (this.countryId) {
      // @ts-ignore
      this.$refs.worldMap.zoomOut(this.countryId);
    }
  }

  handleSongClicked(songId: string, songIndex: number) {
    if (!this.playlist) {
      return;
    }

    // this.playCollection({
    //   collectionId: this.playlist.id,
    //   collectionType: 'playlists',
    //   startPosition: songIndex
    // });

    this.playSongs({
      songs: this.songs,
      sourceInfo: {
        name: this.playlist.attributes!.name,
        path: {
          name: 'playlists',
          params: {
            id: this.playlist.id
          }
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.world-playlist-wrapper {
  position: absolute;
  right: 0;
  width: 50%;
  background-color: var(--v-primary-lighten1);
  transition: top 1s ease, height 1s ease;
  overflow-y: scroll;
}

.go-to-detail-btn {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  top: 50%;
}

.close-btn {
  position: absolute;
  right: 0;
  z-index: 1;
}
</style>
