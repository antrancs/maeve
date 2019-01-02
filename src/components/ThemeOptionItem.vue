<template>
  <v-hover>
    <v-layout
      row
      wrap
      @click="onThemeOptionClicked"
      :class="$style['wrapper']"
      slot-scope="{ hover }"
    >
      <v-flex xs12 style="position: relative">
        <v-flex
          v-if="option.id === selectedOptionId"
          d-flex
          :class="$style['overlay']"
          align-center
        >
          <v-icon medium dark>check</v-icon>
        </v-flex>

        <v-flex
          :class="[$style['overlay'], $style['overlay-edit']]"
          v-show="hover"
        >
          <v-layout
            column
            align-end
            fill-height
            justify-space-between
            class="pr-1"
          >
            <template v-if="option.editable">
              <v-icon small dark class="mt-1" @click.stop="editTheme"
                >edit</v-icon
              >
              <v-icon small dark class="mb-1" @click.stop="deleteTheme"
                >delete</v-icon
              >
            </template>
          </v-layout>
        </v-flex>

        <v-layout row wrap>
          <v-flex xs12>
            <div
              :style="{ 'background-color': option.primary }"
              :class="$style['color-block']"
            ></div>
          </v-flex>
          <v-flex xs6>
            <div
              :style="{ 'background-color': option.secondary }"
              :class="$style['color-block']"
            ></div>
          </v-flex>
          <v-flex xs6>
            <div
              :style="{ 'background-color': option.accent }"
              :class="$style['color-block']"
            ></div>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex class="text-xs-center mt-1">{{ option.name }}</v-flex>
    </v-layout>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ThemeOption } from '@/@types/model/model';
import { Prop } from 'vue-property-decorator';

@Component
export default class ThemeSetting extends Vue {
  @Prop() option!: ThemeOption;
  @Prop() selectedOptionId!: string;
  @Prop({ default: false }) deletable!: boolean;

  onThemeOptionClicked() {
    this.$emit('theme-option-clicked', this.option);
  }

  editTheme() {
    this.$emit('edit-theme', this.option);
  }

  deleteTheme() {
    this.$emit('delete-theme', this.option);
  }
}
</script>

<style lang="scss" module>
.color-block {
  height: 3rem;
}

.wrapper {
  cursor: pointer;
  position: relative;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>
