<template>
  <div
    :class="[$style['wrapper'], { [$style['album']]: isAlbum }]"
    :style="cssProps"
  >
    <img
      v-if="artworks.length <= 2"
      :src="artwork1"
      :class="$style['artwork-one']"
      alt="Artwork"
      v-lazy="artwork1"
    />

    <template v-else>
      <img
        :class="[
          $style['artwork-one-fourth__top-left'],
          $style['artwork-one-fourth']
        ]"
        :src="artwork1"
        alt="Artwork"
      />
      <img
        :class="[
          $style['artwork-one-fourth__top-right'],
          $style['artwork-one-fourth']
        ]"
        :src="artwork2"
        alt=""
      />
      <img
        :class="[
          $style['artwork-one-fourth__bottom-left'],
          $style['artwork-one-fourth']
        ]"
        :src="artwork3"
        alt=""
      />
      <img
        :class="[
          $style['artwork-one-fourth__bottom-right'],
          $style['artwork-one-fourth']
        ]"
        :src="artwork4"
        alt=""
      />
    </template>

    <div v-if="isAlbum" :class="[$style['round-cd'], 'elevation-8']">
      <img :src="artwork1" alt="Artwork" v-lazy="artwork1" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';

@Component
export default class CollectionDetailArtwork extends Vue {
  @Prop() artworks!: MusicKit.Artwork[];
  @Prop({ default: false }) isAlbum!: boolean;
  @Prop() backgroundGradients!: string[];

  get artworkSize() {
    if (this.$vuetify.breakpoint.name === 'xl') {
      return 200;
    }

    return 150;
  }
  get artwork1() {
    if (this.artworks.length === 0) {
      return PLACEHOLDER_IMAGE;
    } else if (this.artworks.length === 1) {
      return getArtworkUrl(
        this.artworks[0],
        this.artworkSize * 2,
        this.artworkSize * 2
      );
    }

    return getArtworkUrl(this.artworks[0], this.artworkSize, this.artworkSize);
  }

  get artwork2() {
    if (this.artworks.length <= 1) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(this.artworks[1], this.artworkSize, this.artworkSize);
  }

  get artwork3() {
    if (this.artworks.length <= 2) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(this.artworks[2], this.artworkSize, this.artworkSize);
  }

  get artwork4() {
    if (this.artworks.length <= 2) {
      return PLACEHOLDER_IMAGE;
    }

    if (this.artworks.length === 3) {
      return getArtworkUrl(
        this.artworks[0],
        this.artworkSize,
        this.artworkSize
      );
    }

    return getArtworkUrl(this.artworks[3], this.artworkSize, this.artworkSize);
  }

  get cssProps() {
    if (!this.backgroundGradients || !this.isAlbum) {
      return {};
    }

    if (this.backgroundGradients.length < 2) {
      return {};
    }

    return {
      '--gradient-color-1': this.backgroundGradients[0],
      '--gradient-color-2': this.backgroundGradients[1]
    };
  }
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.round-cd::before {
  content: '';
  position: absolute;
  width: 25%;
  height: 25%;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    var(--gradient-color-1, white),
    var(--gradient-color-2, rgb(207, 201, 201))
  );
  margin-left: -12.5%;
  margin-top: -12.5%;
}

.round-cd::after {
  content: '';
  position: absolute;
  width: 10%;
  height: 10%;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  background-color: var(--v-primary-base);
  margin-left: -5%;
  margin-top: -5%;
}

.round-cd {
  position: absolute;
  top: 2.5%;
  border-radius: 50%;
  bottom: 2.5%;
  left: 53%;
  // background: red;
  width: 95%;
  z-index: 0;
}

.round-cd img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.artwork-one {
  border-radius: 2rem;
  height: 100%;
  width: 100%;
  object-fit: contain;
  z-index: 1;
}

.album .artwork-one {
  border-radius: 0;
}

.artwork-one-fourth {
  height: 50%;
  width: 50%;
  object-fit: contain;
}

.artwork-one-fourth__top-left {
  border-top-left-radius: 2rem;
}

.artwork-one-fourth__bottom-left {
  border-bottom-left-radius: 2rem;
}

.artwork-one-fourth__top-right {
  border-top-right-radius: 2rem;
}

.artwork-one-fourth__bottom-right {
  border-bottom-right-radius: 2rem;
}
</style>
