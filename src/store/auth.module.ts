import { GetterTree, MutationTree, ActionTree } from 'vuex';

import authService from '@/services/auth.service';
import { AuthState } from './types';
import { SET_USER_TOKEN } from './mutations.type';
import { LOGIN, LOGOUT } from '@/store/actions.type';

const initialState: AuthState = {
  musicUserToken: null
};

const getters: GetterTree<AuthState, any> = {
  isAuthenticated(state): boolean {
    return !!state.musicUserToken;
  }
};

const actions: ActionTree<AuthState, any> = {
  async [LOGIN]() {
    await authService.login();
  },

  async [LOGOUT]() {
    await authService.logout();
  }
};

const mutations: MutationTree<AuthState> = {
  [SET_USER_TOKEN](state, userToken: string | null) {
    state.musicUserToken = userToken;
  }
};

export default {
  state: initialState,
  getters,
  mutations,
  actions
};
