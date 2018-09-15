import { GetterTree, MutationTree, ActionTree } from 'vuex';

import authService from '@/services/auth.service';
import { AuthState } from './types';
import { SET_USER_TOKEN, LOGIN, LOGOUT } from './mutations.type';

const initialState: AuthState = {
  musicUserToken: authService.userToken
};

const getters: GetterTree<AuthState, any> = {
  isAuthenticated(state): boolean {
    return !!state.musicUserToken;
  }
};

const actions: ActionTree<AuthState, any> = {
  [LOGIN]({ commit }) {
    authService.login().then(userToken => {
      commit(SET_USER_TOKEN, userToken);
    });
  },

  [LOGOUT]({ commit }) {
    authService.logout().then(unauthRes => {
      console.log({ unauthRes });
      commit(SET_USER_TOKEN, null);
    });
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
