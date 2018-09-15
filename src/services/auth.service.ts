import musicKit from '@/services/musicKit';

const authService = {
  get isAuthorized(): boolean {
    return musicKit.getInstance().isAuthorized;
  },

  get userToken(): string {
    return musicKit.getInstance().musicUserToken;
  },

  login() {
    return musicKit.getInstance().authorize();
  },

  logout() {
    return musicKit.getInstance().unauthorize();
  }
};

export default authService;
