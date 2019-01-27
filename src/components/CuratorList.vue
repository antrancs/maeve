<template>
  <transition-group name="list" tag="div" class="layout row wrap">
    <CuratorListItem
      v-for="curator in curators"
      :key="curator.id"
      :curator="curator"
    />
  </transition-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Artist } from '@/@types/model/model';
import CuratorListItem from '@/components/CuratorListItem.vue';

@Component({
  components: { CuratorListItem }
})
export default class CuratorList extends Vue {
  @Prop({ default: () => [] })
  curators!: MusicKit.Curator[];
}
</script>
