<template>
  <v-text-field
    label="Search"
    prepend-inner-icon="search"
    flat
    :autofocus="autofocus"
    solo-inverted
    hide-details
    v-model="searchText"
    clearable
    @keydown.stop=""
    @blur="onBlur"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
import debounce from 'lodash/debounce';

@Component
export default class SearchTextField extends Vue {
  private searchText = '';
  private debouncedHandleSearchTextChanged!: () => void;

  @Prop({ default: false }) autofocus!: boolean;

  @Watch('searchText')
  onSearchTextChanged(newVal: string, oldVal: string) {
    this.debouncedHandleSearchTextChanged();
  }

  created() {
    this.debouncedHandleSearchTextChanged = debounce(
      this.handleSearchTextChanged,
      350
    );
  }

  handleSearchTextChanged() {
    if (this.searchText && this.searchText.trim().length > 0) {
      this.$router.push({ name: 'search', query: { q: this.searchText } });
    }
  }

  onBlur() {
    this.$emit('on-blur');
  }
}
</script>
