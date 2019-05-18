<template>
  <v-dialog max-width="600px" v-model="themePreview" persistent>
    <slot slot="activator"></slot>

    <v-card class="primary">
      <v-card-title>
        <span class="headline">{{
          isUpdate ? 'Update theme' : 'New Theme'
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="form">
          <v-text-field
            v-model="themeName"
            label="Theme name *"
            color="accent"
            :rules="[rules.themeName]"
            @keydown.stop=""
          ></v-text-field>

          <h3>Theme preview</h3>

          <div
            class="theme-preview align-center elevation-10 mt-3"
            :style="themePreviewStyle"
          >
            <div
              :style="[secondaryHeaderStyle, textPreviewSecondaryColor]"
              class="secondary-header justify-center align-center"
            >
              Your player bar color
            </div>
            <v-btn :style="[btnPreviewStyle, btnTextPreviewColor]" class="mt-3"
              >Click me</v-btn
            >

            <label class="mt-2" :style="primaryTextPreviewColor"
              >PRIMARY text here</label
            >

            <label class="my-2" :style="secondaryTextPreviewColor"
              >SECONDARY text here</label
            >
          </div>

          <v-tabs
            v-model="active"
            class="mt-3"
            color="primary"
            slider-color="accent"
          >
            <v-tab v-for="preview in colorPreviews" :key="preview.name" ripple>
              {{ preview.name }}
            </v-tab>
            <v-tab-item v-for="preview in colorPreviews" :key="preview.name">
              <v-card
                flat
                color="primary justify-center"
                style="display: flex"
                class="pt-2"
              >
                <chrome-picker v-model="preview.color"></chrome-picker>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="themePreview = false">Cancel</v-btn>
        <v-btn flat @click="handleSave">Looks good</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import ChromePicker from 'vue-color/src/components/Chrome.vue';

import { CreateNewThemeAction, UpdateThemeAction } from '@/store/types';
import { Nullable, ThemeOption } from '@/@types/model/model';
import { CREATE_THEME, UPDATE_THEME } from '@/store/actions.type';
import {
  isLight,
  TEXT_PRIMARY_DARK,
  TEXT_PRIMARY_LIGHT,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from '@/themes';

@Component({
  components: { ChromePicker }
})
export default class ThemeEditorDialog extends Vue {
  static PRIMARY_INDEX = 0;
  static SECONDARY_INDEX = 1;
  static ACCENT_INDEX = 2;

  private themePreview = false;
  private form = false;
  private themeName = '';
  private theme: Nullable<ThemeOption> = null;
  private colorPreviews = [
    {
      name: 'Primary',
      color: {
        hex: this.$vuetify.theme.primary
      }
    },
    {
      name: 'Secondary',
      color: {
        hex: this.$vuetify.theme.secondary
      }
    },
    {
      name: 'Accent',
      color: {
        hex: this.$vuetify.theme.accent
      }
    }
  ];
  private rules = {
    themeName: (value: string) =>
      (value && value.trim().length > 0) || 'Theme name must be provided'
  };
  private active = 1;

  get isUpdate(): boolean {
    return !!this.theme;
  }

  get themePreviewStyle() {
    return {
      'background-color': this.colorPreviews[ThemeEditorDialog.PRIMARY_INDEX]
        .color.hex
    };
  }

  get secondaryHeaderStyle() {
    return {
      'background-color': this.colorPreviews[ThemeEditorDialog.SECONDARY_INDEX]
        .color.hex
    };
  }

  get btnPreviewStyle() {
    return {
      'background-color': this.colorPreviews[ThemeEditorDialog.ACCENT_INDEX]
        .color.hex
    };
  }

  get primaryTextPreviewColor() {
    return {
      color: this.primaryTextColor
    };
  }

  get textPreviewSecondaryColor() {
    return {
      color: isLight(this.colorPreviews[ThemeEditorDialog.SECONDARY_INDEX].color
        .hex as string)
        ? TEXT_PRIMARY_LIGHT
        : TEXT_PRIMARY_DARK
    };
  }

  get primaryTextColor(): string {
    return isLight(this.colorPreviews[ThemeEditorDialog.PRIMARY_INDEX].color
      .hex as string)
      ? TEXT_PRIMARY_LIGHT
      : TEXT_PRIMARY_DARK;
  }

  get secondaryTextColor(): string {
    return isLight(this.colorPreviews[ThemeEditorDialog.PRIMARY_INDEX].color
      .hex as string)
      ? TEXT_SECONDARY_LIGHT
      : TEXT_SECONDARY_DARK;
  }

  get secondaryTextPreviewColor() {
    return {
      color: this.secondaryTextColor
    };
  }

  get btnTextPreviewColor() {
    return {
      color: isLight(this.colorPreviews[ThemeEditorDialog.ACCENT_INDEX].color
        .hex as string)
        ? TEXT_PRIMARY_LIGHT
        : TEXT_PRIMARY_DARK
    };
  }

  @Action [CREATE_THEME]: CreateNewThemeAction;
  @Action [UPDATE_THEME]: UpdateThemeAction;

  @Watch('themePreview')
  onThemeChanged(newVal: boolean, oldVal: boolean) {
    // Dialog is open
    if (newVal) {
      this.active = 0;
      this.colorPreviews[ThemeEditorDialog.PRIMARY_INDEX].color = {
        hex: this.isUpdate ? this.theme!.primary : this.$vuetify.theme.primary
      };
      this.colorPreviews[ThemeEditorDialog.SECONDARY_INDEX].color = {
        hex: this.isUpdate
          ? this.theme!.secondary
          : this.$vuetify.theme.secondary
      };
      this.colorPreviews[ThemeEditorDialog.ACCENT_INDEX].color = {
        hex: this.isUpdate ? this.theme!.accent : this.$vuetify.theme.accent
      };

      this.themeName = this.isUpdate ? this.theme!.name : '';
    } else {
      this.theme = null;
    }
  }

  open(theme: ThemeOption) {
    this.themePreview = true;
    this.theme = theme;
  }

  handleSave() {
    if (!this.form) {
      return;
    }

    const themeValue = {
      primary: this.colorPreviews[ThemeEditorDialog.PRIMARY_INDEX].color
        .hex as string,
      secondary: this.colorPreviews[ThemeEditorDialog.SECONDARY_INDEX].color
        .hex as string,
      accent: this.colorPreviews[ThemeEditorDialog.ACCENT_INDEX].color
        .hex as string,
      primaryText: this.primaryTextColor,
      secondaryText: this.secondaryTextColor,
      name: this.themeName
    };

    if (this.isUpdate) {
      this.updateTheme({
        theme: {
          id: this.theme!.id,
          ...themeValue,
          editable: true
        }
      });
    } else {
      this.createNewTheme(themeValue);
    }

    this.themePreview = false;
  }
}
</script>

<style lang="scss" scoped>
.theme-preview {
  display: flex;
  flex-direction: column;
  height: 18rem;
  width: 100%;
}

.secondary-header {
  display: flex;
  height: 5rem;
  width: 100%;
}
</style>
