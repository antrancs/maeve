<template>
  <div>
    <content-section v-if="featuredRelease">
      <template #section-header>
        {{ featuredReleaseTitle }}
      </template>

      <template #section-content>
        <div class="section-offset">
          <v-flex xs6 sm3 md3 lg4 class="px-2">
            <LinkComponent
              :routeName="featuredRelease.type"
              :routeParams="{ id: featuredRelease.id }"
            >
              <CollectionItemCard :collection="featuredRelease" />
            </LinkComponent>
          </v-flex>
        </div>
      </template>
    </content-section>

    <content-section v-if="topSongs.length > 0">
      <template #section-header>
        Top Songs
      </template>

      <template #section-content>
        <SongListSmall
          :songs="topSongs"
          :sourceInfo="{
            name: `${artistName}'s top songs`,
            path: {
              name: 'artists',
              params: {
                id: artistId
              }
            }
          }"
        />
      </template>
    </content-section>

    <content-section v-if="albums.length > 0">
      <template #section-header>
        Albums
      </template>

      <template #section-content>
        <SongCollectionList
          :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
          :collections="albums"
        />
      </template>
    </content-section>

    <content-section v-if="singles.length > 0">
      <template #section-header>
        EPs & Singles
      </template>

      <template #section-content>
        <SongCollectionList
          :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
          :collections="singles"
        />
      </template>
    </content-section>

    <content-section v-if="artistPlaylists.length > 0">
      <template #section-header>
        Playlists
      </template>

      <template #section-content>
        <SongCollectionList
          :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
          :collections="artistPlaylists"
        />
      </template>
    </content-section>

    <content-section v-if="relatedArtists.length > 0">
      <template #section-header>
        Related artists
      </template>

      <template #section-content>
        <ArtistList
          :artists="relatedArtists"
          :itemSizes="['lg3', 'md3', 'sm3', 'xs6']"
        />
      </template>
    </content-section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

import SongListSmall from '@/components/Song/SongListSmall.vue';
import LinkComponent from '@/components/LinkComponent.vue';
import ArtistList from '@/components/ArtistList.vue';
import SongCollectionList from '@/components/Song/SongCollectionList.vue';
import CollectionItemCard from '@/components/Collection/CollectionItemCard.vue';

@Component({
  components: {
    CollectionItemCard,
    SongCollectionList,
    SongListSmall,
    LinkComponent,
    ArtistList
  }
})
export default class ArtistDetailOverview extends Vue {
  @Prop() featuredRelease!: any;
  @Prop() featuredReleaseTitle!: string;
  @Prop() topSongs!: MusicKit.Song[];
  @Prop() artistName!: string;
  @Prop() artistId!: string;
  @Prop() artistPlaylists!: MusicKit.Playlist[];
  @Prop() relatedArtists!: MusicKit.Artist[];
  @Prop() singles!: MusicKit.Album[];
  @Prop() albums!: MusicKit.Album[];
}
</script>
