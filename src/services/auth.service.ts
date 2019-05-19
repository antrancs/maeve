// import musicKit from '@/services/musicKit';

const authService = {
  get isAuthorized(): boolean {
    return MusicKit.getInstance().isAuthorized;
  },

  get userToken(): string {
    return MusicKit.getInstance().musicUserToken;
  },

  get developerToken(): string {
    return MusicKit.getInstance().developerToken;
  },

  login() {
    return MusicKit.getInstance().authorize();
  },

  logout() {
    return MusicKit.getInstance().unauthorize();
  }
};

export default authService;
