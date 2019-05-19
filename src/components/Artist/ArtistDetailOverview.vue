<template>
  <div>
    <template v-if="featuredRelease">
      <section-header class="mx-2">{{ featuredReleaseTitle }}</section-header>
      <v-flex xs6 sm3 md3 lg4 class="px-2">
        <LinkComponent
          :routeName="featuredRelease.type"
          :routeParams="{ id: featuredRelease.id }"
        >
          <CollectionItemCard :collection="featuredRelease" />
        </LinkComponent>
      </v-flex>
    </template>
    <template v-if="topSongs.length > 0">
      <v-flex xs12 :class="['px-2', { 'pt-4': featuredRelease }]">
        <section-header>Top Songs</section-header>
      </v-flex>
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

    <template v-if="albums.length > 0">
      <v-flex xs12 class="px-2 pt-4">
        <section-header>Albums</section-header>
      </v-flex>
      <SongCollectionList
        :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
        :collections="albums"
      />
    </template>

    <template v-if="singles.length > 0">
      <v-flex xs12 class="px-2 pt-4">
        <section-header>EPs & Singles</section-header>
      </v-flex>
      <SongCollectionList
        :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
        :collections="singles"
      />
    </template>

    <template v-if="artistPlaylists.length > 0">
      <v-flex xs12 class="px-2 pt-4">
        <section-header>Playlists</section-header>
      </v-flex>
      <SongCollectionList
        :itemSizes="['xl3', 'lg3', 'md3', 'sm3', 'xs6']"
        :collections="artistPlaylists"
      />
    </template>

    <template v-if="relatedArtists.length > 0">
      <v-flex xs12 class="px-2 pt-4">
        <section-header>Related artists</section-header>
      </v-flex>
      <ArtistList
        :artists="relatedArtists"
        :itemSizes="['lg3', 'md3', 'sm3', 'xs6']"
      />
    </template>
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