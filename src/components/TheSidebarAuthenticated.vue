<template>
    <div>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'forYou' }">For You</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'myPlaylists' }">Playlists</router-link>
            </li>
        </ul>
        <button @click="logout">Log out</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class SidebarAuthenticated extends Vue {
  @Action logout!: () => void;
}
</script>

<style lang="scss" scoped>
</style>
