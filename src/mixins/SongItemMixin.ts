import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Action, State, Mutation } from 'vuex-class';

import { Song } from '@/@types/model/model';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import { MusicPlayerState } from '@/store/types';
import { SET_SONG_LOADING } from '@/store/mutations.type';

@Component
export default class SongItemMixin extends Vue {
  private showLoading = false;

  @Prop()
  song!: Song | MusicKit.MediaItem;
  @Prop()
  index!: number;
  @Prop({ default: false }) isChart!: boolean;
  @Prop({ default: true })
  isFromAlbum!: boolean;

  @State(state => state.settings.blockedSongs) blockedSongs!: {
    [id: string]: boolean;
  };
  @State(state => state.settings.blockedArtists) blockedArtists!: {
    [id: string]: boolean;
  };
  @State
  musicPlayer!: MusicPlayerState;

  @Getter darkMode!: boolean;
  @Getter isAuthenticated!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  @Mutation [SET_SONG_LOADING]: (isLoading: boolean) => void;

  get isActive(): boolean {
    if (!this.musicPlayer.currentPlaying) {
      return false;
    }

    const currentPlayingId = this.musicPlayer.currentPlaying.id;

    if (this.song.type === 'library-songs' && this.song.attributes) {
      return this.song.attributes.playParams!.catalogId === currentPlayingId;
    }

    return this.song.id === currentPlayingId;
  }

  get isPlaying(): boolean {
    return this.musicPlayer.isPlaying;
  }

  get songNameColor() {
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.$vuetify.theme.primaryText;
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
    // Toggle the song if it's playing
    if (
      this.musicPlayer.currentPlaying &&
      this.musicPlayer.currentPlaying.id === this.song.id
    ) {
      this.toggleCurrentTrack();
      return;
    }

    this.showLoading = true;
    this.setSongLoading(true);

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
