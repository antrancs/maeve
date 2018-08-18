<template>
    <div
      class="media-item"
      @click="play"
    >
        <img
          class="media-item--artwork "
          src="https://is4-ssl.mzstatic.com/image/thumb/Music128/v4/e3/22/79/e3227975-b276-9df2-71ff-22b564bf84a9/075679873682.jpg/500x500bb.jpeg"
          alt=""
        >
        <p>Perception</p>
        <p>Album • 2017</p>
    </div>
</template>

<script>
export default {
  name: 'SongCollectionItem',
  props: {
    collection: {
      type: Object,
      required: false
    }
  },

  methods: {
    play() {
      const { id, kind } = this.collection.playParams;

      // 0: "1368156572" "1368156573"  "1368156576" "1368156577" "1368156579" "1368156580"
      // "1368157211" "1368157215" "1368157216" "1368157223"
      // "1368157234" "1368157238" "1368157724"

      console.log(this.collection);
      // this.$music.addEventListener('playbackProgressDidChange', event => {
      //   if (event.progress === 1) {
      //     this.$music
      //       .setQueue({
      //         song: '1368157234'
      //       })
      //       .then(queue => {
      //         this.$music.play();
      //       });
      //   }
      //   //console.log('didchange', event);
      // });
      this.$music
        .setQueue({
          [kind]: id
        })
        .then(() => {
          this.$music.play();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.media-item:hover {
  cursor: pointer;
}

.media-item--artwork {
  width: 200px;
  height: 200px;
}
</style>
