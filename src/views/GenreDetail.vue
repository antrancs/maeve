<template>
  <div v-if="genre" class="genre">
    <div class="genre-header" :style="headerBackgroundStyle">
      <v-container fill-height>
        <v-layout align-end>
          <h3 class="genre-title" :style="headerOverlayTextStyle">
            {{ genre.name }}
          </h3>
        </v-layout>
      </v-container>
    </div>

    <v-container fluid class="skew-div"></v-container>
    <v-container class="genre-content pt-0">
      <v-layout row wrap style="z-index: 2">
        <v-flex xs12 class="px-2" v-if="playlists.length > 0">
          <h3 class="section-title">Playlists</h3>
        </v-flex>

        <v-flex xs12> <SongCollectionList :collections="playlists" /> </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';

import SongCollectionList from '@/components/SongCollectionList.vue';
import InfiniteScrollMixin from '@/mixins/InfiniteScrollMixin';
import musicApiService from '@/services/musicApi.service';
import { Nullable } from '@/@types/model/model';
import { Genre, GENRES } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';
import { TEXT_PRIMARY_DARK } from '@/themes';
import { Action } from 'vuex-class';

@Component({
  components: { SongCollectionList }
})
export default class GenreDetail extends Mixins(InfiniteScrollMixin) {
  private genre: Nullable<Genre> = null;
  private playlists: MusicKit.Playlist[] = [];
  // private shouldLoad = true;
  // private noMoreData = false;
  private offset = 0;
  @Prop() id!: string;

  created() {
    const genre = GENRES.find(genre => genre.id === this.id);

    if (!genre) {
      this.$router.push({ name: 'NotFound' });
      return;
    }
    this.genre = genre;

    this.$_fetchPlaylists();
  }

  handleScroll() {
    this.$_fetchPlaylists();
  }

  async $_fetchPlaylists() {
    if (!this.genre) {
      return;
    }
    this.shouldLoad = false;

    const {
      data,
      hasNext,
      hasNoData
    } = await musicApiService.getAppleCuratorsPlaylists(this.genre.curatorId, {
      limit: 10,
      offset: this.offset
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

  get headerBackgroundStyle() {
    if (!this.genre) {
      return {};
    }
    return {
      background: `linear-gradient(45deg, ${this.genre.colors.join(',')})`
    };
  }

  get headerOverlayTextStyle() {
    return {
      color: TEXT_PRIMARY_DARK
    };
  }
}
</script>

<style lang="scss" scoped>
.genre-header {
  justify-content: flex-end;
  height: 30vh;
  position: relative;
  width: 100%;
}

.genre-title {
  font-size: $xl-font;
  position: relative;
  z-index: 2;
}

.genre-content {
  position: relative;
  width: 100%;
  z-index: 2;
}

@media (min-width: $bp-phone) {
  .genre-header {
    height: 40vh;
  }
}
</style>
