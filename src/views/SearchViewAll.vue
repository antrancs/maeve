<template>
  <div>
    <section class="content-spacing">
      <h2>All {{ this.$route.params.type }} results for '{{ query }}'</h2>
      <song-collection-list
        v-if="type === 'albums' || type === 'playlists'"
        :collections="data"
      >
      </song-collection-list>

      <artist-list
        v-else-if="type === 'artists'"
        :artists="data"
      >
      </artist-list>

      <song-list
        v-else-if="type === 'songs'"
        :tracks="data"
      >
      </song-list>

      <infinite-loading @infinite="infiniteHandler" spinner="circles">
        <span slot="no-more"></span>
      </infinite-loading>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfiniteLoading from 'vue-infinite-loading';

import SongCollectionList from '@/components/SongCollectionList.vue';
import ArtistList from '@/components/ArtistList.vue';
import SongList from '@/components/SongList.vue';
import musicApiService from '@/services/musicApi.service';
import { HandleSongClicked } from '@/@types/model/model';
import { PLAY_SONGS } from '@/store/actions.type';
import { PlaySongsAction } from '@/store/types';

@Component({
  components: {
    SongCollectionList,
    InfiniteLoading,
    ArtistList,
    SongList
  }
})
export default class SearchViewAll extends Vue {
  // Data
  private offset = 0;
  private fetchLimit = 20;
  private hasNext = true;
  private data: any[] = [];
  private idSet = new Set<string>();

  // Action
  @Action [PLAY_SONGS]: PlaySongsAction;

  // Provide/Inject
  @Provide() handleSongClicked: HandleSongClicked = this.$_playAllSongs;

  // Computed
  get query(): string {
    return this.$route.query.q;
  }

  get type(): string {
    return this.$route.params.type;
  }

  // Life cycle methods
  created() {
    const typeSet = new Set(['albums', 'playlists', 'songs', 'artists']);
    if (!typeSet.has(this.type)) {
      this.$router.push({ name: 'NotFound' });
    }
  }

  // Methods
  infiniteHandler($state: any) {
    // const query = this.$route.query.q;
    const { type } = this.$route.params;

    return musicApiService
      .searchOneResource(this.query, type, this.fetchLimit, this.offset)
      .then(result => {
        if (!result) {
          $state.complete();
          return;
        }

        const { data, hasNext, offset } = result;

        // The api may return duplicate results even with 'offset' provided
        // So we have to use a set to keep track of already loaded items
        data.forEach(item => {
          if (!this.idSet.has(item.id)) {
            this.data.push(item);
            this.idSet.add(item.id);
          }
        });

        this.offset = offset;
        $state.loaded();
        // we probably don't need to load more than 150 items
        if (!hasNext || offset > 150) {
          $state.complete();
        }
      });
  }

  // Helper methods
  /**
   * Play all songs. This method is only applicable for the 'songs' detail view
   * @param index Index of the selected song
   * @param songId Id of the selected song
   */
  private $_playAllSongs(index: number, songId: string) {
    // Make the selected song the first song in the queue
    const songIds = [
      songId,
      ...this.data.filter(song => song.id !== songId).map(song => song.id)
    ];

    this.playSongs({
      ids: songIds
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
