<template>
  <div>
    <div
      :key="artist.id"
      v-for="artist in artists"
      :class="$style['artist-item']"
      @click="$emit('artist-item-clicked', artist.id)"
    >
      <img :src="placeHolderImage" :class="$style['artist-avatar']" />
      <div :class="[$style['artist-name-wrapper'], 'ml-2']">
        <div :class="$style['artist-name']">
          {{ artist.attributes ? artist.attributes.name : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';

@Component
export default class LibraryArtistList extends Vue {
  private placeHolderImage = PLACEHOLDER_IMAGE;

  @Prop() artists!: MusicKit.LibraryArtist[];
}
</script>

<style lang="scss" module>
.artist-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 5.4rem;
}

.artist-avatar {
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
}

.artist-name {
  font-size: 1.8rem;
}

.artist-name-wrapper {
  align-items: center;
  border-bottom: 0.5px solid var(--v-secondaryText-base);
  display: flex;
  height: 100%;
  flex: 1;
}
</style>
