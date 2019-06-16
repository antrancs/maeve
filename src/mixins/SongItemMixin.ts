import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import { Song } from '@/@types/model/model';
import { SET_SONG_LOADING } from '@/store/mutations.type';
import { getArtworkUrl } from '@/utils/utils';

@Component
export default class SongItemMixin extends Vue {
  private showLoading = false;
  private playingControlHovered: boolean = false;

  @Prop()
  song!: Song | MusicKit.MediaItem;
  @Prop()
  index!: number;
  @Prop({ default: false })
  fromAlbum!: boolean;
  @Prop({ default: false }) isMusicPlaying!: boolean;
  @Prop({ default: false }) isActive!: boolean;

  @Getter darkMode!: boolean;
  @Getter isAuthenticated!: boolean;

  @Mutation [SET_SONG_LOADING]: (isLoading: boolean) => void;

  get isAvailable(): boolean {
    return (
      this.song.attributes !== undefined &&
      this.song.attributes.playParams !== undefined
    );
  }

  get leftItemsStyle() {
    if (!this.song || !this.song.attributes) {
      return {};
    }

    if (this.fromAlbum) {
      return {};
    }

    let artworkUrl: string;
    if (this.song.attributes.artwork.url.endsWith('2000x2000bb.jpg')) {
      artworkUrl = this.song.attributes.artwork.url.replace(
        '2000x2000bb.jpg',
        '40x40bb.jpg'
      );
    } else {
      artworkUrl = getArtworkUrl(this.song.attributes.artwork, 40, 40);
    }

    return {
      'background-image': `url(${artworkUrl})`
    };
  }

  get contentIcon(): string {
    if (this.isMusicPlaying && this.isActive) {
      return this.playingControlHovered ? 'pause' : 'headset';
    }
    return 'play_arrow';
  }

  @Watch('musicPlayer.isLoading')
  onLoadingChanged(newValue: boolean) {
    if (!newValue) {
      this.showLoading = false;
    }
  }

  /**
   * Event handler when a song row is clicked
   */
  onSongClicked() {
    if (!this.isAvailable) {
      return;
    }

    this.$emit('song-item-clicked', this.song.id, this.index);
  }

  onActionsIconClicked(event: MouseEvent) {
    event.preventDefault();

    this.$emit('actions-icon-click', this.song, event.clientX, event.clientY);
  }

  handleRightClick(event: MouseEvent) {
    this.$emit('actions-icon-click', this.song, event.clientX, event.clientY);
  }

  onRowClicked() {
    this.$emit('song-item-clicked', this.song.id, this.index);
  }
}
