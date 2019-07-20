<template>
  <v-menu offset-y class="share-icon">
    <v-btn slot="activator" flat icon class="mb-0 mx-0">
      <v-icon>share</v-icon>
    </v-btn>

    <v-list class="pa-0 secondary menu-content">
      <v-list-tile @click="handleCopyLink">
        <v-list-tile-action class="justify-start small-list-tile-action">
          <v-icon>link</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Copy link</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="handleCopyAppleMusicLink">
        <v-list-tile-action class="justify-start small-list-tile-action">
          <v-icon>link</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Copy Apple Music link</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="handleOpenAppleMusic">
        <v-list-tile-action class="justify-start small-list-tile-action">
          <SvgIcon v-if="darkMode" iconName="apple-music-white" />
          <SvgIcon v-else iconName="apple-music-black" />
        </v-list-tile-action>
        <v-list-tile-title> Open in Apple Music</v-list-tile-title>
      </v-list-tile>

      <v-divider></v-divider>
      <v-list-tile @click="handleShareTwitter">
        <v-list-tile-action class="justify-start small-list-tile-action">
          <SvgIcon iconName="twitter" />
        </v-list-tile-action>
        <v-list-tile-title>Share on Twitter</v-list-tile-title>
      </v-list-tile>

      <v-list-tile @click="handleShareFacebook">
        <v-list-tile-action class="justify-start small-list-tile-action">
          <SvgIcon iconName="facebook" />
        </v-list-tile-action>
        <v-list-tile-title>Share on Facebook</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import SvgIcon from '@/components/SvgIcon.vue';
import { copyToClipboard } from '../utils/utils';

@Component({
  components: {
    SvgIcon
  }
})
export default class ShareMenu extends Vue {
  @Prop() appleMusicLink!: string;

  @Getter darkMode!: boolean;

  handleCopyAppleMusicLink() {
    if (!this.appleMusicLink) {
      return;
    }

    copyToClipboard(this.appleMusicLink);
  }

  handleCopyLink() {
    copyToClipboard(window.location.href);
  }

  handleOpenAppleMusic() {
    if (!this.appleMusicLink) {
      return;
    }

    window.open(this.appleMusicLink, '_blank');
  }

  handleShareTwitter() {
    const url = window.location.href;
    window.open(
      'http://twitter.com/share?url=' + encodeURIComponent(url),
      '',
      'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
    );
  }

  handleShareFacebook() {
    const url = window.location.href;

    window.open(
      'http://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
      '',
      'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
    );
  }
}
</script>
