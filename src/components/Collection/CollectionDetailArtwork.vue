<template>
  <div :class="$style['wrapper']">
    <img
      v-if="artworks.length <= 2"
      :src="artwork1"
      :class="$style['artwork-one']"
      alt="Artwork"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtworkUrl } from '@/utils/utils';

@Component
export default class CollectionDetailArtwork extends Vue {
  @Prop() artworks!: string[];

  get artwork1() {
    if (this.artworks.length === 0) {
      return PLACEHOLDER_IMAGE;
    } else if (this.artworks.length === 1) {
      return getArtworkUrl(this.artworks[0], 400, 400);
    }

    return getArtworkUrl(this.artworks[0], 200, 200);
  }

  get artwork2() {
    if (this.artworks.length <= 1) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(this.artworks[1], 200, 200);
  }

  get artwork3() {
    if (this.artworks.length <= 2) {
      return PLACEHOLDER_IMAGE;
    }

    return getArtworkUrl(this.artworks[2], 200, 200);
  }

  get artwork4() {
    if (this.artworks.length <= 2) {
      return PLACEHOLDER_IMAGE;
    }

    if (this.artworks.length === 3) {
      return getArtworkUrl(this.artworks[0], 200, 200);
    }

    return getArtworkUrl(this.artworks[3], 200, 200);
  }
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.artwork-one {
  border-radius: 2rem;
  height: 100%;
  width: 100%;
  object-fit: contain;
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
