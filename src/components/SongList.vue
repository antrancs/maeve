<template>
  <div>
    <song-item
      :key="song.id"
      v-for="song in songs"
      :song="song"
      :collection-type="collectionType"
    >
    </song-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SongItem from './SongItem.vue';

@Component({
  components: { SongItem }
})
export default class SongList extends Vue {
  @Prop() collectionType!: string;
  @Prop() songs!: any[];
}
</script>

<style lang="scss" scoped>
</style>
