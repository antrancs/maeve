<template>
  <div class="song-item">
    <div>{{song.trackNumber}}</div>
    <div>{{song.name}}</div>
    <div>{{song.artistName}}</div>
    <div>{{song.durationInMillis}}</div>
  </div>
</template>

<script>
export default {
  name: 'SongItem',

  props: {
    song: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.song-item {
  display: flex;
}
</style>
