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

<script>
export default {
  name: 'SidebarAuthenticated'
};
</script>

<style lang="scss" scoped>
</style>
