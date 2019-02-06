import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Song, Nullable } from '@/@types/model/model';
import { TOGGLE_CURRENT_TRACK } from '@/store/actions.type';
import { MusicPlayerState } from '@/store/types';

@Component
export default class SongItemMixin extends Vue {
  private showLoading = false;

  @Prop()
  song!: Song;
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

  @Getter darkMode!: boolean;
  @Getter isAuthenticated!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;

  @State
  musicPlayer!: MusicPlayerState;

  get isActive(): boolean {
    if (!this.musicPlayer.currentPlaying) {
      return false;
    }

    const currentPlayingId = this.musicPlayer.currentPlaying.id;

    const isMediaItemBeingPlayed =
      this.musicPlayer.currentPlaying.container !== undefined &&
      this.song.id === this.musicPlayer.currentPlaying.container.id;

    const isResourceBeingPlayed =
      this.song.attributes !== undefined &&
      this.song.attributes.playParams !== undefined &&
      this.song.attributes.playParams.catalogId === currentPlayingId;

    return (
      this.song.id === currentPlayingId ||
      isMediaItemBeingPlayed ||
      isResourceBeingPlayed // when a song is a library-song
    );
  }

  get isPlaying(): boolean {
    return this.musicPlayer.isPlaying;
  }

  get songNameColor() {
    if (this.isSongBlocked || this.isArtistBlocked) {
      return this.$vuetify.theme.secondaryText;
    }
    return this.isActive
      ? this.$vuetify.theme.accent
      : this.$vuetify.theme.primaryText;
  }

  get artists(): Nullable<MusicKit.Artist[]> {
    // album songs shouldn't have relationships
    if (
      !this.song.relationships ||
      !this.song.relationships.artists ||
      this.song.type !== 'songs'
    ) {
      return null;
    }

    return this.song.relationships.artists.data;
  }

  get albums(): Nullable<MusicKit.Album[]> {
    if (
      !this.song.relationships ||
      !this.song.relationships.albums ||
      this.song.type !== 'songs'
    ) {
      return null;
    }
    return this.song.relationships.albums.data;
  }

  get isSongBlocked(): boolean {
    return this.blockedSongs[this.song.id] !== undefined;
  }

  get isArtistBlocked(): boolean {
    if (this.song.relationships && this.song.relationships.artists) {
      for (const artist of this.song.relationships.artists.data) {
        if (!this.blockedArtists[artist.id]) {
          return false;
        }
      }
      return true;
    }
    return false;
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
