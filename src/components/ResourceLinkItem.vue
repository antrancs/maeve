<template>
  <span>
    <router-link
      :to="{ name: resourceType, params: { id: resourceId } }"
      @click.native="$event.stopImmediatePropagation()"
    >
      {{ text }}
    </router-link>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Nullable } from '@/@types/model/model';

@Component
export default class ResourceLinkItem extends Vue {
  @Prop() resource!: MusicKit.Artist | MusicKit.Album;
  @Prop() text!: string;

  get resourceType(): string {
    return this.resource.type;
  }

  get resourceId(): string {
    return this.resource.id;
  }
}
</script>
