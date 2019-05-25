import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';

import { Song } from '@/@types/model/model';
import { SET_SONG_LOADING } from '@/store/mutations.type';

@Component
export default class SongItemMixin extends Vue {
  private showLoading = false;

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

  // get songNameColor() {
  //   if (!this.isAvailable) {
  //     return this.$vuetify.theme.secondaryText;
  //   }

  //   return this.isActive
  //     ? this.$vuetify.theme.accent
  //     : this.$vuetify.theme.primaryText;
  // }

  get isAvailable(): boolean {
    return (
      this.song.attributes !== undefined &&
      this.song.attributes.playParams !== undefined
    );
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
}
