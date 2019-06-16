<template>
  <div>
    <v-toolbar class="primary">
      <v-toolbar-title> Settings </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-layout column fill-height>
        <v-flex d-flex align-center class="mb-2">
          <h3>Themes</h3>
          <v-spacer></v-spacer>
          <app-button @on-click="openThemeEditorDialog">New theme</app-button>
        </v-flex>

        <v-flex class="mb-2">
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

        <v-divider></v-divider>

        <v-flex>
          <h3 class="mt-2">Buttons</h3>
        </v-flex>

        <v-flex>
          <v-radio-group v-model="buttonStyle" row class="mt-0">
            <v-radio label="Normal" value="normal"></v-radio>
            <v-radio label="Round" value="round"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-divider></v-divider>
        <v-flex>
          <h3 class="mt-2">Playback Bitrate</h3>
        </v-flex>
        <v-radio-group v-model="playbackBitrate" row class="mt-0">
          <v-radio label="64 kbps" value="64"></v-radio>
          <v-radio label="256 kbps" value="256"></v-radio>
        </v-radio-group>

        <v-divider></v-divider>
        <v-flex class="mt-2">
          <app-button @on-click="handleLastfmBtnClick" class="ml-0">{{
            isAuthenticatedLastfm ? 'Lastfm Disconnect' : 'Lastfm Connect'
          }}</app-button>
        </v-flex>
      </v-layout>
    </v-container>

    <ThemeEditorDialog v-if="themeEditorDialogVisibility" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ThemeOptionItem from '@/components/Setting/ThemeOptionItem.vue';
import { ThemeOption, Nullable } from '@/@types/model/model';
import { Action, Getter, State } from 'vuex-class';
import {
  SettingsState,
  SelectThemeAction,
  SaveTokenLastfmAction,
  OpenThemeEditorDialogAction
} from '@/store/types';
import {
  DELETE_THEME,
  LOAD_CUSTOM_THEME,
  SELECT_THEME,
  SELECT_BUTTON_STYLES,
  SAVE_TOKEN_LASTFM,
  LOGOUT_LASTFM,
  SELECT_PLAYBACK_BITRATE,
  OPEN_THEME_EDITOR_DIALOG
} from '@/store/actions.type';
import { Watch, Prop } from 'vue-property-decorator';
import { ButtonStyle, PlaybackBitrate } from '@/utils/constants';

@Component({
  components: {
    ThemeOptionItem,
    ThemeEditorDialog: () =>
      import('@/components/Setting/ThemeEditorDialog.vue')
  }
})
export default class ThemeSetting extends Vue {
  private popup: Nullable<Window>;

  @Getter themes!: ThemeOption[];
  @Getter isAuthenticatedLastfm!: boolean;

  @State settings!: SettingsState;
  @State(state => state.themeEditorDialog.visibility)
  themeEditorDialogVisibility!: boolean;

  @Action [DELETE_THEME]: (id: string) => void;
  @Action [SELECT_THEME]: SelectThemeAction;
  @Action [SELECT_BUTTON_STYLES]: (buttonStyle: ButtonStyle) => void;
  @Action [SELECT_PLAYBACK_BITRATE]: (bitrate: PlaybackBitrate) => void;
  @Action [SAVE_TOKEN_LASTFM]: SaveTokenLastfmAction;
  @Action [LOGOUT_LASTFM]: () => void;
  @Action [OPEN_THEME_EDITOR_DIALOG]: OpenThemeEditorDialogAction;

  get buttonStyle(): string {
    return this.settings.buttonStyle;
  }

  get playbackBitrate(): string {
    return this.settings.playbackBitrate.toString();
  }

  get selectedThemeId(): string {
    return this.settings.selectedTheme.id;
  }

  set buttonStyle(val: string) {
    this.selectButtonStyle(val as ButtonStyle);
  }

  set playbackBitrate(val: string) {
    this.selectPlaybackBitrate(+val as PlaybackBitrate);
  }

  handleThemeSelection(theme: ThemeOption) {
    this.selectTheme({ theme });
  }

  handleEditTheme(theme: ThemeOption) {
    this.openThemeEditorDialog({
      themeToEdit: theme
    });
  }

  handleDeleteTheme(theme: ThemeOption) {
    this.deleteTheme(theme.id);
  }

  handleLastfmBtnClick() {
    if (this.isAuthenticatedLastfm) {
      // log out
      this.logoutLastfm();
    } else {
      this.openLastFmPopup();
    }
  }

  openLastFmPopup() {
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const url = '/lastfm/auth';

    window.addEventListener('message', this.updateAuthInfo);

    this.popup = window.open(
      url,
      '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
    );
  }

  updateAuthInfo(event: any) {
    if (this.popup && event.data.source === '/auth/lastfm/success') {
      const { token } = event.data.payload;

      if (token) {
        this.saveTokenLastfm(token);
      }

      window.removeEventListener('message', this.updateAuthInfo);
      this.popup.close();
    }
  }
}
</script>
