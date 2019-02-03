<template>
  <v-layout row align-center :class="['mx-2', $style['wrapper']]">
    <div :class="$style['rank']">{{ artist['@attr'].rank }}</div>

    <div :class="$style['artwork']">
      <MediaArtwork
        :width="64"
        :height="64"
        :artworkUrlForArtist="artistImageUrl"
        :isRound="true"
      />
    </div>

    <v-flex :class="['mx-2', $style['link']]">
      <template>
        <LinkComponent
          v-if="artist.appleMusicId"
          routeName="artists"
          :routeParams="{ id: artist.appleMusicId }"
        >
          {{ artist.name }}
        </LinkComponent>
        <template v-else>{{ artist.name }}</template>
      </template>
    </v-flex>

    <div>
      {{ artist.playcount }} {{ artist.playcount > 1 ? 'plays' : 'play' }}
    </div>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import MediaArtwork from '@/components/MediaArtwork.vue';
import LinkComponent from '@/components/LinkComponent.vue';

@Component({
  components: {
    MediaArtwork,
    LinkComponent
  }
})
export default class ArtistListLastfmItem extends Vue {
  @Prop() artist!: any;

  get artistImageUrl(): string {
    const mediumImage = this.artist.image.find(
      (img: any) => img.size === 'medium'
    );

    return mediumImage['#text'];
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 5rem;
}

.artwork {
  width: 4rem;
  height: 4rem;
}

.rank {
  font-weight: bold;
  width: 3rem;
}

.link a {
  color: var(--v-primaryText-base);
}

.link a:hover {
  text-decoration: underline;
}
</style>
