<template>
  <div style="width: 100%">
    <transition-group
      :name="direction"
      style="position: relative; overflow: hidden; display: flex; align-items: center"
      :style="slideHeightStyle"
    >
      <img
        v-for="artwork in artworks"
        :key="artwork.id"
        v-lazy="artwork.artwork"
        :class="`artwork ${artwork.class}`"
        alt="Song artwork"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Getter, State } from 'vuex-class';
import { PlayQueueSong } from '@/@types/model/model';
import { getArtworkUrl } from '@/utils/utils';

@Component
export default class ArtworkSlide extends Vue {
  @Prop({ default: 'none' }) direction!: string;
  @Prop() artworkSize!: number;

  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: PlayQueueSong;

  @Getter nextSong!: PlayQueueSong;
  @Getter previousSong!: PlayQueueSong;

  get slideHeightStyle() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return {
          height: '75vw'
        };
      case 'sm':
        return {
          height: '50vw'
        };
      default:
        return {
          height: '25vw'
        };
    }
  }

  get artworks() {
    const artworks = [];
    const songs = [this.previousSong, this.currentPlaying, this.nextSong];
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      if (!song) {
        continue;
      }

      artworks.push({
        id: song.qId,
        artwork: getArtworkUrl(
          song.attributes!.artwork.url,
          this.artworkSize,
          this.artworkSize
        ),
        class: `artwork${i}`
      });
    }
    return artworks;
  }
}
</script>

<style lang="scss" scoped>
.artwork {
  position: absolute;
  transition: opacity 0.8s, left 0.8s, width 0.8s;
}

.artwork0,
.artwork.right-leave,
.artwork.left-enter-to,
.artwork.artwork0.right-enter-to,
.artwork.artwork0.left-enter-to {
  left: -40%;
  width: 50%;
}

.artwork1 {
  left: 20%;
  width: 60%;
  box-shadow: 0.2rem 0.2rem 1rem #ffffff;
}

.artwork2,
.artwork.right-enter-to,
.artwork.left-leave,
.artwork.artwork2.right-enter-to,
.artwork.artwork2.left-enter-to {
  left: 90%;
  width: 50%;
}

.artwork.right-enter,
.artwork.left-leave-to,
.artwork.artwork2.right-enter,
.artwork.artwork2.left-enter,
.artwork.artwork2.right-leave-to,
.artwork.artwork2.left-leave-to {
  opacity: 0;
  left: 120%;
}

.artwork.right-leave-to,
.artwork.left-enter,
.artwork.artwork0.right-enter,
.artwork.artwork0.left-enter,
.artwork.artwork0.left-leave-to,
.artwork.artwork0.right-leave-to {
  left: -60%;
  opacity: 0;
}

.right-enter {
  opacity: 0;
}

.right-leave-active {
  transition: opacity 0.8s, left 0.8s, width 0.8s;
}

.right-enter-active {
  transition: opacity 0.8s, left 0.8s, width 0.8s;
}
</style>
