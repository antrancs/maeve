<template>
  <div>
    <ul class="sidebar-menu">
      <li class="sidebar-menu-item">
        <router-link to="/">
          <div class="flex-row sidebar-menu-item__wrapper">
            <div class="sidebar-menu-item__icon">
              <icon name="home" class="icon icon--l">
              </icon>
            </div>
            
            <div class="sidebar-menu-item__text">
              Home
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <p class="unauthorize-message">Log in with your Apple Music to listen to full songs and manage your playlists</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SidebarUnauthenticated extends Vue {}
</script>

<style lang="scss" scoped>
.unauthorize-message {
  display: none;
  margin: 0;
  padding: $m-size;
}

@media (min-width: $bp-tablet-landscape) {
  .unauthorize-message {
    display: block;
  }
}
</style>
