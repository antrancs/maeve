<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 md7 class="pr-3">
        <template v-if="recentTracks">
          <h2>Recent Tracks</h2>
          <SongListSmall
            :songs="recentTracks"
            :sourceInfo="{
              name: 'Lastfm top songs',
              path: {
                name: 'lastfm'
              }
            }"
          />
        </template>
      </v-flex>
      <v-flex xs12 sm6 md5>
        <template v-if="topArtists">
          <h2>Top Artists</h2>
          <ArtistListLastfm :artists="topArtists" />
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import ArtistListLastfm from '@/components/Lastfm/ArtistListLastfm.vue';
import SongListSmall from '@/components/Song/SongListSmall.vue';
import {
  FETCH_TOP_ARTISTS_LASTFM,
  FETCH_RECENT_TRACKS_LASTFM
} from '@/store/actions.type';
import { Nullable, LastfmSong } from '@/@types/model/model';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';

@Component({
  components: {
    ArtistListLastfm,
    SongListSmall
  }
})
export default class Lastfm extends Mixins(DataLoadingMixin) {
  private topArtists: Nullable<any[]> = null;
  private recentTracks: Nullable<LastfmSong[]> = null;

  @Action [FETCH_TOP_ARTISTS_LASTFM]: () => Promise<any[]>;
  @Action [FETCH_RECENT_TRACKS_LASTFM]: () => Promise<LastfmSong[]>;

  created() {
    const fetchTopArtistsPromise = this.fetchTopArtistsLastFm();
    const fetchRecentTrackPromise = this.fetchRecentTracksLastfm();

    Promise.all([fetchTopArtistsPromise, fetchRecentTrackPromise])
      .then(results => {
        this.topArtists = results[0];
        this.recentTracks = results[1];
      })
      .finally(() => {
        this.dataLoadingDone();
      });
  }
}
</script>
