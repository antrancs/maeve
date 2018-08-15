<template>
    <div class="sidebar">
        <h3>Your Music</h3>
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

<script>
export default {
  name: 'AppSidebar'
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
}
</style>
