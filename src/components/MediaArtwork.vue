<template>
  <div
    class="artwork"
    v-if="artworkUrlForArtist || artworkUrl"
    :style="roundStyle"
  >
    <img
      class="artwork__image"
      :key="artworkUrlForArtist || artworkUrl"
      v-lazy="artworkUrlForArtist || artworkUrl"
      alt
      :style="[artworkImageStyle, roundStyle]"
    />

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getArtworkUrl } from '@/utils/utils';
import { Nullable } from '@/@types/model/model';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';

@Component
export default class MediaArtwork extends Vue {
  // Only artists need to pass in artwork url as Artwork is not available under artists for now.
  // For other types (albums, playlists, tracks...) pass the artwork object instead
  @Prop()
  artworkUrlForArtist!: string;
  @Prop()
  artwork!: Nullable<MusicKit.Artwork>; // In some cases, some resources don't have an Artwork property
  @Prop()
  width!: number;
  @Prop()
  height!: number;
  @Prop({ default: false })
  hasShadow!: boolean;
  @Prop({ default: false })
  isRound!: boolean;

  get roundStyle() {
    if (this.isRound) {
      return {
        'border-radius': '50%'
      };
    }
    return {};
  }

  get artworkImageStyle(): object {
    const style: any = {};

    if (this.hasShadow) {
      let shadowColor: string;

      if (this.artwork && this.artwork.textColor1) {
        shadowColor = this.artwork.textColor1;
      } else {
        shadowColor = 'ffffff';
      }

      style['box-shadow'] = `0.2rem 0.2rem 1rem #${shadowColor}`;
    }

    return style;
  }

  get artworkUrl(): string {
    if (!this.artwork) {
      return PLACEHOLDER_IMAGE;
    }
    return getArtworkUrl(this.artwork.url, this.width, this.height);
  }
}
</script>

<style scoped lang="scss">
.artwork {
  position: relative;
  width: 100%;
}

.artwork__image-wrapper {
  align-items: center;
  display: flex;
  height: 100%;
  width: 100%;
}

.artwork__image {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
