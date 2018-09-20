import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';

import AppSidebar from '@/components/TheSidebar.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TheSidebar.vue', () => {
  let getters: any;
  let store: Store<any>;

  const factory = (options?: {
    currentTrackArtwork?: () => string;
    isAuthenticated?: () => boolean;
  }) => {
    store = new Vuex.Store({
      getters: {
        ...getters,
        ...options
      }
    });
    return shallowMount(AppSidebar, { store, localVue });
  };

  beforeEach(() => {
    getters = {
      currentTrackArtwork: () => '',
      isAuthenticated: () => true
    };
  });

  it('Should not render song artwork image when the url is empty', () => {
    const wrapper = factory();
    expect(wrapper.contains('img')).toBe(false);
  });

  it('Should render unauthenticated-sidebar when not authenticated', () => {
    const wrapper = factory({
      isAuthenticated: () => false
    });

    expect(wrapper.contains('sidebarunauthenticated-stub')).toBe(true);
  });

  it('Should render authenticated-sidebar when authenticated', () => {
    const wrapper = factory();

    expect(wrapper.contains('sidebarauthenticated-stub')).toBe(true);
  });
});
