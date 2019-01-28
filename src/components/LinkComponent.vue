<template>
  <router-link :to="{ name: routeName, params: routeParams }">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class LinkComponent extends Vue {
  @Prop() routeName!: string;
  @Prop() routeParams!: object;
}
</script>
