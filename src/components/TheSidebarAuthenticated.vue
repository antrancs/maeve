<template>
  <div>
    <ul class="sidebar__menu">
      <li class="menu__item-row">
        <router-link to="/">
          <div class="flex-row menu__item">
            <div class="menu__item-icon">
              <icon name="home" class="icon icon--l">
              </icon>
            </div>
            
            <div class="menu__item-text">
              Home
            </div>
          </div>
        </router-link>
      </li>
      <li class="menu__item-row">
        <router-link :to="{ name: 'forYou' }">
          <div class="flex-row menu__item">
            <div class="menu__item-icon">
              <icon name="grin-hearts" class="icon icon--l">
              </icon>
            </div>
            <div class="menu__item-text">
              For You
            </div>
          </div>
        </router-link>
      </li>

      <li class="menu__item-row">
        <router-link :to="{ name: 'myPlaylists' }">
          <div class="flex-row menu__item">
            <div class="menu__item-icon">
              <icon name="headset" class="icon icon--l">
              </icon>
            </div>
            <div class="menu__item-text">
              Your Library
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <button class="btn-logout button" @click="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import 'vue-awesome/icons/home';
import 'vue-awesome/icons/grin-hearts';
import 'vue-awesome/icons/headset';

import { LOGOUT } from '@/store/actions.type';

@Component
export default class SidebarAuthenticated extends Vue {
  @Action [LOGOUT]: () => void;
}
</script>

<style lang="scss" scoped>
</style>
