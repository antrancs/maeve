import { ActionTree } from 'vuex';

import router from '@/router';
import { CHANGE_ROUTE } from './actions.type';

const actions: ActionTree<any, any> = {
  [CHANGE_ROUTE](context, routeName: string) {
    router.push({ name: routeName });
  }
};

export default {
  actions
};
