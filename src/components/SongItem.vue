<template>
  <div class="song-item" @click="play">
    <div class="song-item__left">
      <div class="song-item__track-number">{{ song.trackNumber }}</div>
      <div>{{ song.name }}</div>
    </div>

    <div class="song-item__middle">
      <div>{{ song.artistName }}</div>
      <div>{{ song.albumName }}</div>
    </div>

    <div class="song-item__right">
      <div class="option">
        <icon class="icon" name="ellipsis-v"></icon>
      </div>
      <div>{{ song.durationInMillis | formatSongDuration }}</div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/ellipsis-v';
import Icon from 'vue-awesome/components/Icon.vue';

export default {
  name: 'SongItem',

  components: {
    Icon
  },

  props: {
    song: {
      type: Object,
      required: true
    }
  },

  methods: {
    play() {
      console.log('Playing song');
    }
  },

  filters: {
    formatSongDuration(value) {
      if (!value) {
        return '0:00';
      }
      const durationInSeconds = Math.floor(value / 1000);
      const NUMBER_OF_SECONDS_IN_A_MINUTE = 60;
      const minutes = Math.trunc(
        durationInSeconds / NUMBER_OF_SECONDS_IN_A_MINUTE
      );
      const seconds = durationInSeconds % NUMBER_OF_SECONDS_IN_A_MINUTE;
      return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.song-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 56px;
  border-bottom: 0.5px solid gray;

  &:hover {
    .option {
      opacity: 1;
    }
    background-color: yellow;
  }
}

.song-item__left {
  display: flex;
  flex-basis: 35%;
}

.song-item__middle {
  display: flex;
  flex-basis: 55%;

  :nth-child(1) {
    flex-basis: 45%;
    margin-right: 5%;
  }

  :nth-child(2) {
    flex-basis: 55%;
  }
}

.song-item__right {
  display: flex;
  justify-content: flex-end;
  flex-basis: 10%;
}

.song-item__track-number {
  flex: 0 0 30px;
  text-align: center;
}

.option {
  opacity: 0;
}
</style>
