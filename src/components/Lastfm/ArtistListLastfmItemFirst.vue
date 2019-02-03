<template>
  <div :class="[$style['wrapper']]" :style="cssProps">
    <div :class="[$style['footer']]">
      <v-layout
        :class="['mx-2', $style['link']]"
        row
        wrap
        align-center
        fill-height
      >
        <template v-if="artist.appleMusicId">
          <LinkComponent
            routeName="artists"
            :routeParams="{ id: artist.appleMusicId }"
          >
            <h2>{{ artist.name }}</h2>
          </LinkComponent>
        </template>

        <h2 v-else>{{ artist.name }}</h2>

        <v-spacer></v-spacer>
        <div>
          {{ artist.playcount }} {{ artist.playcount > 1 ? 'plays' : 'play' }}
        </div>
      </v-layout>
    </div>
  </div>
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

  get cssProps() {
    return {
      '--artist-lastfm-bg-image': `url(${this.artistImageUrl})`
    };
  }

  get artistImageUrl(): string {
    const xlImage = this.artist.image.find(
      (img: any) => img.size === 'extralarge'
    );

    return xlImage['#text'];
  }
}
</script>

<style lang="scss" module>
.wrapper {
  align-items: flex-end;
  display: flex;
  height: 30rem;
  width: 100%;
  position: relative;
}

.wrapper::before {
  content: '';
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: var(--artist-lastfm-bg-image);
  background-repeat: no-repeat;
  background-size: cover;
}

.footer {
  background-color: rgba(0, 0, 0, 0.8);
  height: 5rem;
  width: 100%;
  z-index: 1;
}

.link a {
  color: var(--v-primaryText-base);
}

.link a:hover {
  text-decoration: underline;
}
</style>
