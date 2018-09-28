import musicKit from '@/services/musicKit';

const authService = {
  get isAuthorized(): boolean {
    return musicKit.getInstance().isAuthorized;
  },

  get userToken(): string {
    return musicKit.getInstance().musicUserToken;
  },

  get developerToken(): string {
    return musicKit.getInstance().developerToken;
  },

  login() {
    return musicKit.getInstance().authorize();
  },

  logout() {
    return musicKit.getInstance().unauthorize();
  }
};

export default authService;
