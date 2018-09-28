import { GetterTree, MutationTree, ActionTree } from 'vuex';

import authService from '@/services/auth.service';
import apiService from '@/services/musicApi.service';
import { AuthState } from './types';
import { SET_USER_TOKEN } from './mutations.type';
import { LOGIN, LOGOUT } from '@/store/actions.type';

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

      // This is not a good way of updating the store front.
      // Will make an API module later
      apiService.updateUserStorefront();
    });
  },

  [LOGOUT]({ commit }) {
    authService.logout().then(() => {
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
