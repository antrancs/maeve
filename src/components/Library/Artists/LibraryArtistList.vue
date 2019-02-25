<template>
  <div>
    <div
      :key="artist.id"
      v-for="artist in artists"
      :class="[
        $style['artist-item'],
        {
          [$style['artist-item--selected']]: selectedArtistId === artist.id
        }
      ]"
      @click="() => handleArtistClicked(artist)"
    >
      <img :src="placeHolderImage" :class="$style['artist-avatar']" />
      <div :class="[$style['artist-name-wrapper'], 'ml-2']">
        <div :class="[$style['artist-name']]">
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
import { Nullable } from '@/@types/model/model';

@Component
export default class LibraryArtistList extends Vue {
  private placeHolderImage = PLACEHOLDER_IMAGE;
  private selectedArtistId: Nullable<string> = null;

  @Prop() artists!: MusicKit.LibraryArtist[];

  handleArtistClicked(artist: MusicKit.LibraryArtist) {
    this.$emit('artist-item-clicked', artist.id);
    this.selectedArtistId = artist.id;
  }
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

.artist-item--selected .artist-name-wrapper {
  background-color: var(--v-primary-lighten1);
}

.artist-item--selected .artist-name {
  font-weight: bold;
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
