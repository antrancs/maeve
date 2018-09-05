<template>
    <div>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="about">About</router-link>
            </li>
            <li>Playlists</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class SidebarAuthenticated extends Vue {}
</script>

<style lang="scss" scoped>
</style>
