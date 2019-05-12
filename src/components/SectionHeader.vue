<template>
  <h3 :style="sectionHeaderStyle"><slot></slot></h3>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class SectionHeader extends Vue {
  @Prop() title!: string;

  get sectionHeaderStyle() {
    return {
      'font-size': this.$vuetify.breakpoint.name === 'xs' ? '2.5rem' : '3rem'
    };
  }
}
</script>
