import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';

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

  // @State
  // musicPlayer!: MusicPlayerState;

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

    const artworkUrl = getArtworkUrl(this.song.attributes.artwork, 40, 40);

    return {
      background: `url(${artworkUrl})`
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
    this.$emit('song-item-clicked', this.song.id, this.index);
  }

  onActionsIconClicked(event: MouseEvent) {
    event.preventDefault();

    // this.$root.$mediaActionMenu.open(this.song, event.clientX, event.clientY);
    this.$emit('actions-icon-click', this.song, event.clientX, event.clientY);
  }

  handleRightClick(event: MouseEvent) {
    this.$emit('actions-icon-click', this.song, event.clientX, event.clientY);
  }

  onRowClicked() {
    this.$emit('song-item-clicked', this.song.id, this.index);
  }
}
