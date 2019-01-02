<template>
  <div>
    <v-toolbar class="primary">
      <v-toolbar-title> Settings </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-layout column fill-height>
        <v-flex d-flex align-center class="mb-2">
          <h2>Themes</h2>
          <v-spacer></v-spacer>
          <theme-editor-dialog ref="newThemeDialog">
            <app-button>New theme</app-button>
          </theme-editor-dialog>
        </v-flex>

        <v-flex>
          <v-layout flow wrap>
            <v-flex
              xs6
              class="pr-2 pt-2"
              v-for="theme in themes"
              :key="theme.id"
            >
              <ThemeOptionItem
                :option="theme"
                :selectedOptionId="selectedThemeId"
                @theme-option-clicked="handleThemeSelection"
                @edit-theme="handleEditTheme"
                @delete-theme="handleDeleteTheme"
              />
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex> <h2 class="mt-2">Buttons</h2> </v-flex>

        <v-flex>
          <v-radio-group v-model="buttonStyle" row class="mt-0">
            <v-radio label="Normal" value="normal"></v-radio>
            <v-radio label="Round" value="round"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ThemeOptionItem from '@/components/ThemeOptionItem.vue';
import ThemeEditorDialog from '@/components/ThemeEditorDialog.vue';
import { ThemeOption } from '@/@types/model/model';
import { Action, Getter, State } from 'vuex-class';
import { SettingsState, SelectThemeAction } from '@/store/types';
import {
  DELETE_THEME,
  LOAD_CUSTOM_THEME,
  SELECT_THEME,
  SELECT_BUTTON_STYLES
} from '@/store/actions.type';
import { Watch, Prop } from 'vue-property-decorator';
import { ButtonStyle } from '@/utils/constants';

@Component({
  components: {
    ThemeOptionItem,
    ThemeEditorDialog
  }
})
export default class ThemeSetting extends Vue {
  // private buttonStyle = settings.;

  @Getter themes!: ThemeOption[];
  @State settings!: SettingsState;

  @Action [LOAD_CUSTOM_THEME]: () => void;
  @Action [DELETE_THEME]: (id: string) => void;
  @Action [SELECT_THEME]: SelectThemeAction;
  @Action [SELECT_BUTTON_STYLES]: (buttonStyle: ButtonStyle) => void;

  get buttonStyle(): string {
    return this.settings.buttonStyle;
  }

  get selectedThemeId(): string {
    return this.settings.selectedTheme.id;
  }

  set buttonStyle(val: string) {
    this.selectButtonStyle(val as ButtonStyle);
  }

  created() {
    this.loadCustomThemes();
  }

  handleThemeSelection(theme: ThemeOption) {
    this.selectTheme({ theme });
  }

  handleEditTheme(theme: ThemeOption) {
    // @ts-ignore
    this.$refs.newThemeDialog.open(theme);
  }

  handleDeleteTheme(theme: ThemeOption) {
    this.deleteTheme(theme.id);
  }
}
</script>
