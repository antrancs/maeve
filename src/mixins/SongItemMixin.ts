import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Getter, Action, State, Mutation } from 'vuex-class';
import { Song, Nullable } from '@/@types/model/model';
import {
  TOGGLE_CURRENT_TRACK,
  FETCH_CATALOG_SONG_DETAILS
} from '@/store/actions.type';
import { MusicPlayerState } from '@/store/types';
import { SET_SONG_LOADING } from '@/store/mutations.type';

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
  @State
  musicPlayer!: MusicPlayerState;

  @Getter darkMode!: boolean;
  @Getter isAuthenticated!: boolean;

  @Action
  [TOGGLE_CURRENT_TRACK]: () => void;
  @Action [FETCH_CATALOG_SONG_DETAILS]: (
    ids?: string[]
  ) => Promise<MusicKit.Song[]>;

  @Mutation [SET_SONG_LOADING]: (isLoading: boolean) => void;

  get isActive(): boolean {
    if (!this.musicPlayer.currentPlaying) {
      return false;
    }

    const currentPlayingId = this.musicPlayer.currentPlaying.id;

    // const isMediaItemBeingPlayed =
    //   this.musicPlayer.currentPlaying.container !== undefined &&
    //   this.song.id === this.musicPlayer.currentPlaying.container.id;

    // const isResourceBeingPlayed =
    //   this.song.attributes !== undefined &&
    //   this.song.attributes.playParams !== undefined &&
    //   this.song.attributes.playParams.catalogId === currentPlayingId;

    return (
      this.song.id === currentPlayingId
      // isMediaItemBeingPlayed ||
      // isResourceBeingPlayed // when a song is a library-song
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

  goToAlbumPage() {
    let songId: string | undefined;

    switch (this.song.type) {
      case 'songs':
        songId = this.song.id;
        break;
      case 'library-songs':
        if (this.song.attributes && this.song.attributes.playParams) {
          songId = this.song.attributes.playParams.catalogId;
        }
    }

    if (!songId) {
      return;
    }
    this.fetchCatalogSongsDetails([songId]).then(songs => {
      const song = songs[0];

      if (song && song.relationships && song.relationships.albums) {
        const album = song.relationships.albums.data[0];

        this.$router.push({ name: 'albums', params: { id: album.id } });
      }
    });
  }
}
