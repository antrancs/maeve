<template>
  <v-flex
    xs6
    sm3
    md2
    :class="{
      'pa-2': $vuetify.breakpoint.mdAndUp,
      'pa-1': $vuetify.breakpoint.mdAndDown
    }"
  >
    <router-link :to="{ name: curator.type, params: { id: curator.id } }">
      <v-card class="secondary elevation-8 item-card">
        <div class="pa-3">
          <MediaArtwork
            class="elevation-10"
            :artwork-url-for-artist="curatorArtwork"
            :isRound="true"
          />
        </div>

        <v-card-title primary-title class="py-2 px-2">
          <v-layout column wrap>
            <div
              class="long-text-truncated main-info-text artist-item__name text-xs-center"
              style="width: 100%"
            >
              {{ curator.attributes.name }}
            </div>
          </v-layout>
        </v-card-title>
      </v-card>
    </router-link>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getArtworkUrl } from '@/utils/utils';
import { Artist } from '@/@types/model/model';
import MediaArtwork from '@/components/MediaArtwork.vue';
import { Action } from 'vuex-class';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';

@Component({
  components: {
    MediaArtwork
  }
})
export default class CuratorListItem extends Vue {
  @Prop()
  curator!: MusicKit.Curator;

  get curatorArtwork(): string {
    if (
      !this.curator ||
      !this.curator.attributes ||
      !this.curator.attributes.artwork
    ) {
      return PLACEHOLDER_IMAGE;
    }

    let curatorArtwork: number;
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        curatorArtwork = 50;
        break;
      case 'sm':
        curatorArtwork = 80;
        break;
      case 'md':
        curatorArtwork = 120;
        break;
      case 'lg':
        curatorArtwork = 170;
        break;
      default:
        // 'xl'
        curatorArtwork = 250;
    }

    return getArtworkUrl(
      this.curator.attributes.artwork.url,
      curatorArtwork,
      curatorArtwork
    );
  }
}
</script>
