<template>
  <div>
    <ul class="sidebar-menu">
      <li class="sidebar-menu-item">
        <router-link to="/">
          <div class="flex-row sidebar-menu-item__wrapper">
            <div class="sidebar-menu-item__icon">
              <icon name="home" class="icon icon--l"></icon>
            </div>

            <div class="sidebar-menu-item__text">Home</div>
          </div>
        </router-link>
      </li>
      <li class="sidebar-menu-item">
        <router-link :to="{ name: 'forYou' }">
          <div class="flex-row sidebar-menu-item__wrapper">
            <div class="sidebar-menu-item__icon">
              <icon name="grin-hearts" class="icon icon--l"></icon>
            </div>
            <div class="sidebar-menu-item__text">For You</div>
          </div>
        </router-link>
      </li>

      <li class="sidebar-menu-item">
        <router-link :to="{ name: 'myLibrary' }">
          <div class="flex-row sidebar-menu-item__wrapper">
            <div class="sidebar-menu-item__icon">
              <icon name="headset" class="icon icon--l"></icon>
            </div>
            <div class="sidebar-menu-item__text">My Library</div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import 'vue-awesome/icons/home';
import 'vue-awesome/icons/grin-hearts';
import 'vue-awesome/icons/headset';

@Component
export default class SidebarAuthenticated extends Vue {}
</script>

<style lang="scss" scoped></style>
