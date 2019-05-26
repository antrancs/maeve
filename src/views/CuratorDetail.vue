<template>
  <div v-if="curator" class="wrapper" fluid>
    <div class="curator-detail-header">
      <div class="banner" :style="bannerStyle"></div>
      <div class="banner-overlay flex-column curator-banner-overlay">
        <v-container fill-height>
          <v-layout column justify-center align-center>
            <MediaArtwork
              style="width: 150px; height: 150px"
              :artworkUrlForArtist="curatorArtwork"
              :width="150"
              :height="150"
              :has-shadow="true"
              :isRound="true"
            />
            <h2 class="curator-name white-text">
              {{ curator.attributes.name }}
            </h2>
          </v-layout>
        </v-container>
      </div>
    </div>

    <v-container>
      <v-layout row wrap>
        <p
          class="px-4 hidden-xs-only white-text"
          v-html="curator.attributes.editorialNotes.standard"
        ></p>
        <template v-if="playlists.length > 0">
          <v-flex xs12 class="px-2 pt-4">
            <section-header>Playlists</section-header>
          </v-flex>
          <SongCollectionList :collections="playlists" />
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';

import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import MediaArtwork from '@/components/MediaArtwork.vue';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { Action } from 'vuex-class';
import {
  FETCH_ONE_CURATOR,
  FETCH_CURATOR_PLAYLISTS
} from '@/store/actions.type';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { Route } from 'vue-router';
import { getArtworkUrl } from '@/utils/utils';
import { Nullable } from '@/@types/model/model';
import { FetchCuratorPlaylistsAction } from '@/store/types';
import { getCuratorBanner } from '../services/catalog.service';

@Component({
  components: { SongCollectionList, MediaArtwork }
})
export default class CuratorDetail extends Mixins(InfiniteScrollMixin) {
  private curator: Nullable<MusicKit.Curator> = null;
  private offset = 0;
  private playlists: MusicKit.Playlist[] = [];
  private curatorBanner = '';
  @Prop() id!: string;

  @Action [FETCH_ONE_CURATOR]: (id: string) => Promise<MusicKit.Curator>;
  @Action [FETCH_CURATOR_PLAYLISTS]: FetchCuratorPlaylistsAction;

  created() {
    this.$_getCuratorInfo();
  }

  get curatorArtwork(): string {
    if (
      !this.curator ||
      !this.curator.attributes ||
      !this.curator.attributes.artwork
    ) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(this.curator.attributes.artwork, 150, 150);
  }

  get bannerStyle(): object {
    return {
      'background-image': `url('${this.curatorBanner}')`
    };
  }

  handleScroll() {
    this.$_fetchCuratorPlaylists();
  }

  $_getCuratorInfo() {
    this.fetchOneCurator(this.id).then(curator => {
      this.curator = curator;

      getCuratorBanner(
        curator.attributes!.url,
        curator.id,
        this.$vuetify.breakpoint.name
      ).then(url => {
        this.curatorBanner = url;
      });
    });
    this.$_fetchCuratorPlaylists();
  }

  async $_fetchCuratorPlaylists() {
    this.shouldLoad = false;

    const { data, hasNext, hasNoData } = await this.fetchCuratorPlaylists({
      id: this.id,
      offset: this.offset,
      limit: 10
    });

    this.playlists.push(...data);
    this.shouldLoad = true;

    this.offset += 10;
    // when there's no more data or we've reached the max items (70)
    if (!hasNext || this.offset === 70) {
      this.shouldLoad = false;
      this.noMoreData = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

.curator-detail-header {
  height: 50vh;
  position: relative;
}

.banner-overlay {
  background-color: rgba(
    $color: (
      #000000
    ),
    $alpha: 0.6
  );
  height: 100%;
  position: relative;
  z-index: 2;
}

.curator-banner-overlay {
  justify-content: flex-end;
}

.curator-name {
  font-size: $xl-font;
}

.bio-toggle {
  font-weight: bold;
  cursor: pointer;
}
</style>
