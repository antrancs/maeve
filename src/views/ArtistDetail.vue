<template>
  <v-container :class="['py-0', { 'px-0': $vuetify.breakpoint.smAndDown }]">
    <v-layout v-if="artist" row wrap style="height: 100%">
      <v-flex xs12 lg5 v-if="hasBanner">
        <div
          :class="{
            [$style['left-column-sticky']]: $vuetify.breakpoint.lgAndUp,
            [$style['playing']]: currentPlaying,
            [$style['minimized']]: playerBarMinimized,
            [$style['left-column']]: $vuetify.breakpoint.mdAndDown
          }"
        >
          <div :class="$style['banner-header']" :style="bannerHeaderStyle">
            <nav
              v-if="$vuetify.breakpoint.lgAndUp"
              v-show="loadingDone"
              :class="['absolute-fit', 'pr-2', $style['nav']]"
            >
              <ul>
                <li
                  v-for="item in visibleNavigationItems"
                  :key="item.value"
                  :class="[
                    'mb-2',
                    $style['nav-item'],
                    { [$style['active']]: currentTab === item.value }
                  ]"
                  @click="currentTab = item.value"
                >
                  <span :class="[$style['nav-item-text'], 'pb-1']">{{
                    item.text
                  }}</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </v-flex>
      <v-flex
        xs12
        :class="[
          { 'pt-4': $vuetify.breakpoint.mdAndDown },
          { 'pl-2 pt-2': $vuetify.breakpoint.lgAndUp && hasBanner },
          { 'px-3': $vuetify.breakpoint.smAndDown },
          hasBanner ? 'lg7' : 'lg12'
        ]"
      >
        <keep-alive>
          <component
            :is="currentTabComponent"
            v-bind="currentTabProps"
          ></component>
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Route } from 'vue-router';

import ArtistDetailOverview from '@/components/Artist/ArtistDetailOverview.vue';
import ArtistInfo from '@/components/Artist/ArtistInfo.vue';
import DataLoadingMixin from '@/mixins/DataLoadingMixin';
import {
  Nullable,
  Album,
  Artist,
  Playlist,
  Collection
} from '@/@types/model/model';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';
import { getArtistResources } from '../services/catalog.service';
import { SET_FOOTER_VISIBILITY } from '../store/mutations.type';
import { getArtist } from '../services/musicApi.service';

@Component({
  components: {
    ArtistInfo,
    ArtistDetailOverview,
    ArtistDetailAbout: () => import('@/components/Artist/ArtistDetailAbout.vue')
  }
})
export default class ArtistDetail extends Mixins(DataLoadingMixin) {
  private artist: Nullable<Artist> = null;
  private artistInfo: any = null;
  private resources: any = [];

  private loadingDone = false;
  private currentTab = 'overview';
  private navigationItems: {
    [id: string]: {
      value: string;
      component: string;
      text: string;
      shouldShow: boolean;
    };
  } = {
    overview: {
      text: 'Overview',
      value: 'overview',
      component: 'ArtistDetailOverview',
      shouldShow: true
    },
    about: {
      text: 'About',
      value: 'about',
      component: 'ArtistDetailAbout',
      shouldShow: true
    }
  };

  @Prop() id!: string;

  // used to adjust the height of the left column when there's a player bar
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;
  @State(state => state.musicPlayer.minimized) playerBarMinimized!: boolean;

  @Mutation [SET_FOOTER_VISIBILITY]: (visibility: boolean) => void;

  get visibleNavigationItems() {
    return Object.values(this.navigationItems).filter(item => item.shouldShow);
  }

  get currentTabComponent(): string {
    return this.navigationItems[this.currentTab].component;
  }

  get currentTabProps() {
    if (this.currentTab === 'overview') {
      return {
        hasBanner: this.hasBanner,
        resources: this.resources,
        artist: {
          name: this.artistName,
          id: this.id,
          ...this.artistInfo
        }
      };
    }
    return {
      bio: this.artistInfo.bio,
      birthday: this.artistInfo.birthday,
      origin: this.artistInfo.origin
    };
  }

  get artistName() {
    if (!this.artist) {
      return '';
    }
    return this.artist.attributes ? this.artist.attributes.name : '';
  }

  get bannerHeaderStyle() {
    if (!this.artistInfo || !this.artistInfo.bannerUrl) {
      return {};
    }

    const style: any = {};

    switch (this.$vuetify.breakpoint.name) {
      case 'md':
        style.height = '50vh';
        break;
      case 'sm':
        style.height = '50vw';
        break;
      case 'xs':
        style.height = '80vw';
    }

    style['background-image'] = `url('${this.artistInfo.bannerUrl}')`;

    return style;
  }

  get hasBanner(): boolean {
    if (!this.artistInfo) {
      return false;
    }
    return (
      this.artistInfo.bannerUrl &&
      this.artistInfo.bannerUrl !== PLACEHOLDER_IMAGE
    );
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    this.$emit('show-extended-header', {
      component: null,
      props: null
    });
    this.artist = null;
    this.artistInfo = null;
    this.resources = [];
    this.loadingDone = false;
    window.scrollTo(0, 0);
    this.$_getArtistInfo();
  }

  created() {
    this.$_getArtistInfo();
    this.setFooterVisibility(false);
  }

  beforeDestroy() {
    this.$emit('show-extended-header', {
      component: null,
      props: null
    });
    this.setFooterVisibility(true);
  }

  // Helper methods
  private $_getArtistInfo() {
    const artistId = this.id;

    getArtist(artistId).then(artist => {
      this.artist = artist;
      this.$_showArtistInfoHeader();
      this.$_getArtistDetails();
    });
  }

  private $_getArtistDetails() {
    if (!this.artist || !this.artist.attributes) {
      return;
    }

    if (this.artist.type === 'library-artists') {
      return;
    }

    getArtistResources(
      this.artist.attributes.url,
      this.artist.id,
      this.$vuetify.breakpoint.name
    )
      .then((artistDetail: any) => {
        const { artist, resources } = artistDetail;

        this.artistInfo = artist;
        this.resources = resources;

        if (
          !this.artistInfo.bio &&
          !this.artistInfo.birthday &&
          !this.artistInfo.origin
        ) {
          this.navigationItems['about'].shouldShow = false;
        } else {
          this.navigationItems['about'].shouldShow = true;
        }

        this.loadingDone = true;
      })
      .finally(() => this.dataLoadingDone());
  }

  private $_showArtistInfoHeader() {
    if (!this.artist || !this.artist.attributes) {
      return;
    }
    this.$emit('show-extended-header', {
      component: ArtistInfo,
      props: {
        name: this.artistName,
        url: (this.artist.attributes as MusicKit.ArtistAttributes).url
      },
      height: 50
    });
  }
}
</script>

<style lang="scss" module>
.left-column-sticky {
  height: calc(100vh - 64px - 50px);
  position: sticky;
  top: 114px;
  transition: height 0.25s ease-out;
}

.left-column-sticky.playing {
  height: calc(100vh - 64px - 50px - 86px);
}

.left-column-sticky.playing.minimized {
  height: calc(100vh - 64px - 16px);
}

.left-column-sticky .banner-header::before {
  background: linear-gradient(to right, transparent 70%, var(--v-primary-base)),
    linear-gradient(
      to top,
      var(--v-primary-base) 1%,
      transparent 70%,
      var(--v-primary-base)
    );
}

.left-column-sticky .banner-header {
  justify-content: center;
}

.left-column .banner-header {
  align-items: flex-end;
}

.left-column .banner-header::before {
  background: linear-gradient(transparent -30%, var(--v-primary-base));
}

.banner-header {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
  position: relative;
  display: flex;
  flex-direction: row;
}

.banner-header::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.nav {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav ul {
  list-style-type: none;
}

.nav-item {
  color: var(--v-secondaryText-base);
  cursor: pointer;
  font-weight: 500;
  text-transform: uppercase;
  text-align: right;
}

.nav-item.active {
  color: var(--v-primaryText-base);
}

.nav-item-text {
  position: relative;
}

.active .nav-item-text {
  border-bottom: 0.3rem solid var(--v-accent-base);
}
</style>
