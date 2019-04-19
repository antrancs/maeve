<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 md7 class="pr-3">
        <template v-if="recentTracks">
          <h2>Recent Tracks</h2>
          <SongListSmall :songs="recentTracks" />
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action } from 'vuex-class';

import ArtistListLastfm from '@/components/Lastfm/ArtistListLastfm.vue';
import SongListSmall from '@/components/Song/SongListSmall.vue';
import {
  FETCH_TOP_ARTISTS_LASTFM,
  FETCH_RECENT_TRACKS_LASTFM
} from '@/store/actions.type';
import { Nullable, LastfmSong } from '@/@types/model/model';

@Component({
  components: {
    ArtistListLastfm,
    SongListSmall
  }
})
export default class Lastfm extends Vue {
  private topArtists: Nullable<any[]> = null;
  private recentTracks: Nullable<LastfmSong[]> = null;

  @Action [FETCH_TOP_ARTISTS_LASTFM]: () => Promise<any[]>;
  @Action [FETCH_RECENT_TRACKS_LASTFM]: () => Promise<LastfmSong[]>;

  created() {
    this.fetchTopArtistsLastFm().then(artists => {
      this.topArtists = artists;
    });

    this.fetchRecentTracksLastfm().then(tracks => {
      this.recentTracks = tracks;
    });
  }
}
</script>
