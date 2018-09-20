<template>
  <div>
    <ul class="sidebar__menu">
      <li class="sidebar__menu-item">
        <router-link to="/">Home</router-link>
      </li>
      <li class="sidebar__menu-item">
        <router-link :to="{ name: 'forYou' }">For You</router-link>
      </li>


      <router-link tag="li" :to="{ name: 'myPlaylists' }" class="sidebar__menu-item">
        <a>Your Library</a>
      </router-link>
    </ul>
    <button @click="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { LOGOUT } from '@/store/actions.type';

@Component
export default class SidebarAuthenticated extends Vue {
  @Action [LOGOUT]: () => void;
}
</script>

<style lang="scss" scoped>
</style>
